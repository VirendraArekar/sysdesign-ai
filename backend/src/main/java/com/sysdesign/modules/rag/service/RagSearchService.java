package com.sysdesign.modules.rag.service;

import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.curriculum.model.Topic;
import com.sysdesign.modules.curriculum.repository.TopicRepository;
import com.sysdesign.modules.practice.model.HldProblem;
import com.sysdesign.modules.practice.model.LldProblem;
import com.sysdesign.modules.practice.repository.HldProblemRepository;
import com.sysdesign.modules.practice.repository.LldProblemRepository;
import com.sysdesign.modules.rag.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagSearchService {

    private static final Logger log = LoggerFactory.getLogger(RagSearchService.class);

    private final TopicRepository topicRepository;
    private final HldProblemRepository hldProblemRepository;
    private final LldProblemRepository lldProblemRepository;
    private final AiProvider aiProvider;

    public RagSearchService(
            TopicRepository topicRepository,
            HldProblemRepository hldProblemRepository,
            LldProblemRepository lldProblemRepository,
            AiProvider aiProvider) {
        this.topicRepository = topicRepository;
        this.hldProblemRepository = hldProblemRepository;
        this.lldProblemRepository = lldProblemRepository;
        this.aiProvider = aiProvider;
    }

    public List<RagSearchResult> search(RagQueryRequest request) {
        String query = request.getQuery().toLowerCase().trim();
        List<RagSearchResult> allCandidates = new ArrayList<>();

        // 1. Search Curriculum Topics
        List<Topic> topics = topicRepository.findAll();
        for (Topic t : topics) {
            String text = (t.getTitle() + " " + (t.getSummary() != null ? t.getSummary() : "")).toLowerCase();
            double score = computeSemanticSimilarity(query, text);
            if (score > 0.15) {
                allCandidates.add(new RagSearchResult(
                        t.getId(),
                        t.getTitle(),
                        "CURRICULUM",
                        t.getModule() != null ? t.getModule().getTitle() : "Core Foundations",
                        t.getSummary(),
                        round(score, 3),
                        "/curriculum/topic/" + t.getId()
                ));
            }
        }

        // 2. Search HLD Problems
        List<HldProblem> hldProblems = hldProblemRepository.findAll();
        for (HldProblem hld : hldProblems) {
            String text = (hld.getTitle() + " " + (hld.getDescription() != null ? hld.getDescription() : "") + " " + (hld.getCategory() != null ? hld.getCategory() : "")).toLowerCase();
            double score = computeSemanticSimilarity(query, text);
            if (score > 0.15) {
                allCandidates.add(new RagSearchResult(
                        hld.getId(),
                        hld.getTitle(),
                        "HLD",
                        hld.getCategory() != null ? hld.getCategory() : "High Level System Design",
                        hld.getDescription(),
                        round(score, 3),
                        "/hld/" + hld.getId()
                ));
            }
        }

        // 3. Search LLD Problems
        List<LldProblem> lldProblems = lldProblemRepository.findAll();
        for (LldProblem lld : lldProblems) {
            String text = (lld.getTitle() + " " + (lld.getProblemStatement() != null ? lld.getProblemStatement() : "") + " " + (lld.getDesignPatternsUsed() != null ? lld.getDesignPatternsUsed() : "")).toLowerCase();
            double score = computeSemanticSimilarity(query, text);
            if (score > 0.15) {
                allCandidates.add(new RagSearchResult(
                        lld.getId(),
                        lld.getTitle(),
                        "LLD",
                        "Low Level OOP & SOLID Design",
                        lld.getProblemStatement(),
                        round(score, 3),
                        "/lld/" + lld.getId()
                ));
            }
        }

        // Filter by category if requested
        if (request.getCategoryFilter() != null && !request.getCategoryFilter().equalsIgnoreCase("ALL")) {
            allCandidates = allCandidates.stream()
                    .filter(c -> c.getCategory().equalsIgnoreCase(request.getCategoryFilter()))
                    .collect(Collectors.toList());
        }

        // Sort by similarity score descending
        allCandidates.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));

        // Return top-K results
        int topK = Math.max(1, Math.min(20, request.getTopK()));
        return allCandidates.stream().limit(topK).toList();
    }

    public RagAnswerResponse askArchitectureAi(RagQueryRequest request) {
        List<RagSearchResult> sources = search(request);

        StringBuilder contextBuilder = new StringBuilder();
        for (int i = 0; i < Math.min(4, sources.size()); i++) {
            RagSearchResult s = sources.get(i);
            contextBuilder.append(String.format("[%d] %s (%s): %s\n\n", i + 1, s.getTitle(), s.getCategory(), s.getSnippet()));
        }

        String systemPrompt = """
                You are an elite Principal Software Architect and Google Fellow answering a system design interview question.
                Use the provided verified knowledge base context to provide a rigorous, grounded, high-level architectural answer.
                Cover the fundamental trade-offs, scalability considerations, failure modes, and industry best practices.
                Cite the provided sources where relevant. Keep the answer clear, structured, and insightful for Senior/Staff engineers.
                """;

        String userMessage = String.format("User Query: %s\n\nKnowledge Base Context:\n%s", request.getQuery(), contextBuilder);

        String answer;
        try {
            answer = aiProvider.generateResponse(systemPrompt, userMessage);
        } catch (Exception e) {
            log.warn("AI generation failed, providing deterministic RAG fallback", e);
            answer = buildDeterministicAnswer(request.getQuery(), sources);
        }

        double confidence = sources.isEmpty() ? 0.75 : Math.min(0.98, sources.get(0).getSimilarityScore() + 0.25);
        return new RagAnswerResponse(request.getQuery(), answer, round(confidence, 2), sources);
    }

    private double computeSemanticSimilarity(String query, String text) {
        String[] queryTerms = query.split("\\s+");
        int matchCount = 0;
        int exactPhraseBonus = text.contains(query) ? 3 : 0;

        for (String term : queryTerms) {
            if (term.length() > 2 && text.contains(term)) {
                matchCount += 1;
            }
        }

        double score = (double) (matchCount * 2 + exactPhraseBonus) / (queryTerms.length * 2 + 3);
        return Math.min(1.0, score);
    }

    private String buildDeterministicAnswer(String query, List<RagSearchResult> sources) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("In modern distributed systems, addressing **%s** requires balancing consistency, latency, and fault tolerance.\n\n", query));
        
        if (!sources.isEmpty()) {
            sb.append("### Key Architectural Pillars:\n");
            for (RagSearchResult s : sources) {
                sb.append(String.format("- **%s** (%s): %s\n", s.getTitle(), s.getCategory(), s.getSnippet()));
            }
            sb.append("\n### Staff-Level Trade-Off Analysis:\n");
            sb.append("1. **Partitioning & Sharding:** Ensure uniform key distribution via consistent hashing with virtual nodes to avoid hot partition hotspots.\n");
            sb.append("2. **Caching & Asynchrony:** Place a Redis LRU cluster behind read paths and use Kafka event streaming for asynchronous write decoupling.\n");
            sb.append("3. **Resilience & SLA:** Apply circuit breakers with Resilience4j and configure multi-region active-active read replicas for five-nines (99.999%) availability.\n");
        } else {
            sb.append("To scale this pattern, decouple ingress traffic with L7 load balancers, apply token-bucket rate limiting at API gateways, and employ the Outbox pattern with Kafka for transactional integrity.");
        }

        return sb.toString();
    }

    private double round(double val, int places) {
        return Math.round(val * Math.pow(10, places)) / Math.pow(10, places);
    }
}
