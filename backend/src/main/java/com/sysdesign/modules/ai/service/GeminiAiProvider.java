package com.sysdesign.modules.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);

    private final String apiKey;
    private final String model;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiAiProvider(
            @Value("${ai.gemini.api-key:}") String apiKey,
            @Value("${ai.gemini.model:gemini-2.5-flash}") String model,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model != null && !model.isBlank() ? model : "gemini-2.5-flash";
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public String generateResponse(String systemPrompt, String userMessage) {
        if (apiKey.isEmpty() || apiKey.equals("test-mock-key")) {
            return simulateStaffResponse(userMessage);
        }

        try {
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey);

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt + "\n\nUser Question:\n" + userMessage)))
                    )
            );

            String requestBody = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode candidateText = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (!candidateText.isMissingNode()) {
                    return candidateText.asText();
                }
            } else {
                log.warn("Gemini API returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("Gemini API invocation failed, falling back to simulated staff engineer response: {}", e.getMessage());
        }

        return simulateStaffResponse(userMessage);
    }

    @Override
    public String generateFollowUpQuestion(String problemTitle, String level, String stage, List<Map<String, String>> conversationHistory) {
        String lastCandidateAnswer = "";
        if (!conversationHistory.isEmpty()) {
            lastCandidateAnswer = conversationHistory.get(conversationHistory.size() - 1).getOrDefault("content", "");
        }

        String prompt = String.format(
                "Interview Problem: %s\nTarget Candidate Level: %s\nCurrent Stage: %s\nCandidate's Last Answer:\n%s\n\n" +
                "As a Principal Architect, ask the single next most insightful follow-up question. Probe their trade-offs or scalability limits.",
                problemTitle, level, stage, lastCandidateAnswer
        );

        return generateResponse(PromptTemplates.PRINCIPAL_ARCHITECT_SYSTEM_PROMPT, prompt);
    }

    @Override
    public String generateStructuredEvaluation(String problemTitle, String level, List<Map<String, String>> conversationHistory) {
        if (apiKey.isEmpty() || apiKey.equals("test-mock-key")) {
            return simulateEvaluationJson(problemTitle, level);
        }

        try {
            StringBuilder transcript = new StringBuilder();
            for (Map<String, String> msg : conversationHistory) {
                transcript.append(msg.getOrDefault("role", "User")).append(": ").append(msg.getOrDefault("content", "")).append("\n\n");
            }

            String prompt = String.format(
                    "Evaluate this System Design Interview Transcript for %s (%s Level):\n\n%s",
                    problemTitle, level, transcript
            );

            String result = generateResponse(PromptTemplates.EVALUATION_SYSTEM_PROMPT, prompt);
            if (result.contains("{") && result.contains("}")) {
                int start = result.indexOf("{");
                int end = result.lastIndexOf("}") + 1;
                return result.substring(start, end);
            }
        } catch (Exception e) {
            log.warn("Structured evaluation generation failed: {}", e.getMessage());
        }

        return simulateEvaluationJson(problemTitle, level);
    }

    private String simulateStaffResponse(String prompt) {
        String lower = prompt.toLowerCase();
        if (lower.contains("capacity") || lower.contains("qps") || lower.contains("estimation")) {
            return "Good start on the numbers. Let's calculate the peak QPS and 5-year storage: if you have 100M daily active users each performing 10 actions/day, what is the average and peak write QPS, and how much RAM do you need for caching the 20% hot data?";
        } else if (lower.contains("api") || lower.contains("endpoint")) {
            return "The API contracts look reasonable. How are you handling authentication tokens, idempotency on write calls, and rate limiting to prevent client denial-of-service?";
        } else if (lower.contains("database") || lower.contains("db") || lower.contains("postgres") || lower.contains("sql")) {
            return "You selected this database store. Walk me through your sharding strategy: what is your shard key, how do you handle cross-shard queries, and what happens when you need to double the number of shards?";
        } else if (lower.contains("cache") || lower.contains("redis")) {
            return "You mentioned Redis. What happens when a hot cache key expires and 50,000 requests hit the database simultaneously (Cache Stampede)? How will you safeguard against cache penetration?";
        } else if (lower.contains("failure") || lower.contains("spof") || lower.contains("partition")) {
            return "Suppose the primary database region suffers a total fiber cut and network partition. How does your system detect the failure, prevent split-brain writes, and what is your expected RTO and RPO?";
        }

        return "That's a solid architectural premise. Can you deep dive into your component breakdown: how do requests flow from the client through DNS, CDN, and load balancers to your stateless microservice fleet?";
    }

    private String simulateEvaluationJson(String problemTitle, String level) {
        return """
        {
          "overallScore": 86.5,
          "categoryScores": {
            "Requirement Understanding": 90,
            "Functional Requirements": 88,
            "Non-Functional Requirements": 85,
            "Capacity Estimation": 82,
            "API Design": 85,
            "Database Design": 88,
            "Architecture Topology": 90,
            "Scalability": 86,
            "Availability": 88,
            "Reliability": 84,
            "Consistency & CAP Trade-offs": 85,
            "Fault Tolerance": 86,
            "Security": 82,
            "Trade-off Articulation": 87,
            "Communication": 89
          },
          "strengths": [
            "Clear articulation of stateless microservice tier and separation of concerns",
            "Effective use of distributed caching with Redis to shield database read operations",
            "Sound choice of sharding key preventing unbalanced partition hotspots"
          ],
          "weaknesses": [
            "Could have explored asynchronous Transactional Outbox pattern earlier in the messaging section",
            "Initial capacity estimation overlooked index and replication factor storage overhead"
          ],
          "missingConcepts": [
            "Circuit Breaker pattern for downstream third-party payment integration",
            "Bloom Filters for mitigating cache penetration"
          ],
          "incorrectAssumptions": [
            "Assumed zero replication lag across multi-region read replicas"
          ],
          "suggestedImprovements": [
            "Adopt the XFetch algorithm or mutex locks to eliminate cache stampedes on hot keys",
            "Add distributed tracing headers (W3C traceparent) across inter-service gRPC hops"
          ],
          "idealAnswerOutline": "1. Clarify 100M DAU with 10:1 Read/Write split.\\n2. Scale horizontally with stateless Envoy + Spring Boot fleet.\\n3. Shard PostgreSQL using hash(id) % N with read replicas.\\n4. Implement Redis Cache-Aside with 20% hot dataset sizing.\\n5. Decouple background processing with Kafka event streams.",
          "recommendedTopics": [
            "Transactional Outbox Pattern",
            "Cache Stampede Mitigation",
            "Distributed Locks & Fencing Tokens"
          ]
        }
        """;
    }
}
