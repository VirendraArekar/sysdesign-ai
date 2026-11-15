package com.sysdesign.modules.interview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sysdesign.common.exception.BadRequestException;
import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.modules.ai.model.AiUsageLog;
import com.sysdesign.modules.ai.repository.AiUsageLogRepository;
import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.interview.dto.*;
import com.sysdesign.modules.interview.model.InterviewEvaluation;
import com.sysdesign.modules.interview.model.InterviewMessage;
import com.sysdesign.modules.interview.model.InterviewSession;
import com.sysdesign.modules.interview.repository.InterviewEvaluationRepository;
import com.sysdesign.modules.interview.repository.InterviewMessageRepository;
import com.sysdesign.modules.interview.repository.InterviewSessionRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMessageRepository messageRepository;
    private final InterviewEvaluationRepository evaluationRepository;
    private final AiUsageLogRepository usageLogRepository;
    private final AiProvider aiProvider;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    // Interview Stages Progression
    private static final List<String> STAGES = List.of(
            "REQUIREMENTS",
            "CAPACITY_ESTIMATION",
            "API_DESIGN",
            "DATABASE_DESIGN",
            "HIGH_LEVEL_ARCH",
            "SCALABILITY_CHALLENGE",
            "SECURITY_AND_SPOF",
            "TRADE_OFFS",
            "COMPLETED"
    );

    public InterviewService(InterviewSessionRepository sessionRepository,
                            InterviewMessageRepository messageRepository,
                            InterviewEvaluationRepository evaluationRepository,
                            AiUsageLogRepository usageLogRepository,
                            AiProvider aiProvider,
                            SimpMessagingTemplate messagingTemplate,
                            ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.evaluationRepository = evaluationRepository;
        this.usageLogRepository = usageLogRepository;
        this.aiProvider = aiProvider;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public InterviewSessionDto startSession(UUID userId, StartInterviewRequest request) {
        InterviewSession session = new InterviewSession(
                userId,
                request.category(),
                request.targetLevel(),
                request.interviewerPersona() != null ? request.interviewerPersona() : "STAFF_ENGINEER",
                request.problemTitle()
        );
        session.setCurrentStage("REQUIREMENTS");
        InterviewSession savedSession = sessionRepository.save(session);

        // Generate First Interviewer Question
        String openingQuestion = String.format(
                "Welcome to your %s System Design Interview. Today, I'd like you to design %s targeting %s level. " +
                "To begin, how would you clarify the core functional and non-functional requirements?",
                savedSession.getCategory(), savedSession.getProblemTitle(), savedSession.getTargetLevel()
        );

        InterviewMessage msg = new InterviewMessage(
                savedSession,
                "INTERVIEWER",
                "REQUIREMENTS",
                openingQuestion,
                1
        );
        messageRepository.save(msg);
        savedSession.getMessages().add(msg);

        // Track AI Usage
        usageLogRepository.save(new AiUsageLog(userId, "INTERVIEW_OPENING", "gemini-2.5-flash", 60, 45, 120));

        return toSessionDto(savedSession);
    }

    @Transactional
    public InterviewSessionDto submitCandidateReply(UUID userId, UUID sessionId, CandidateReplyRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found: " + sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to interview session");
        }

        if ("COMPLETED".equalsIgnoreCase(session.getStatus())) {
            throw new BadRequestException("This interview session has already ended");
        }

        if (request.durationDeltaSeconds() != null) {
            session.setDurationSeconds(session.getDurationSeconds() + request.durationDeltaSeconds());
        }

        List<InterviewMessage> existingMessages = messageRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId);
        int nextSeq = existingMessages.size() + 1;

        // 1. Record Candidate Reply
        InterviewMessage candidateMsg = new InterviewMessage(
                session,
                "CANDIDATE",
                session.getCurrentStage(),
                request.content(),
                nextSeq++
        );
        messageRepository.save(candidateMsg);

        // 2. Advance Interview Stage
        int currentStageIdx = STAGES.indexOf(session.getCurrentStage());
        String nextStage = currentStageIdx >= 0 && currentStageIdx < STAGES.size() - 2
                ? STAGES.get(currentStageIdx + 1)
                : STAGES.get(STAGES.size() - 2);
        session.setCurrentStage(nextStage);

        // 3. Assemble context & generate follow-up question
        List<Map<String, String>> history = new ArrayList<>();
        for (InterviewMessage m : existingMessages) {
            history.add(Map.of("role", m.getSenderRole(), "content", m.getContent()));
        }
        history.add(Map.of("role", "CANDIDATE", "content", request.content()));

        long startMs = System.currentTimeMillis();
        String aiFollowUp = aiProvider.generateFollowUpQuestion(
                session.getProblemTitle(),
                session.getTargetLevel(),
                nextStage,
                history
        );
        long latency = System.currentTimeMillis() - startMs;

        // 4. Save AI Interviewer Follow-Up Message
        InterviewMessage interviewerMsg = new InterviewMessage(
                session,
                "INTERVIEWER",
                nextStage,
                aiFollowUp,
                nextSeq
        );
        messageRepository.save(interviewerMsg);

        // Log token usage
        usageLogRepository.save(new AiUsageLog(userId, "INTERVIEW_FOLLOW_UP", "gemini-2.5-flash", 350, 120, (int) latency));

        sessionRepository.save(session);

        // 5. Broadcast to WebSocket Subscribers
        InterviewMessageDto broadcastDto = toMessageDto(interviewerMsg);
        try {
            messagingTemplate.convertAndSend("/topic/interview/" + sessionId, broadcastDto);
        } catch (Exception e) {
            // Ignore if no active WS listener
        }

        return getSessionById(userId, sessionId);
    }

    @Transactional
    public InterviewSessionDto finishSession(UUID userId, UUID sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found: " + sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to session");
        }

        session.setStatus("COMPLETED");
        session.setCurrentStage("COMPLETED");
        session.setCompletedAt(Instant.now());

        List<InterviewMessage> messages = messageRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId);
        List<Map<String, String>> history = messages.stream()
                .map(m -> Map.of("role", m.getSenderRole(), "content", m.getContent()))
                .collect(Collectors.toList());

        // Generate 15-Category Structured Evaluation
        long startMs = System.currentTimeMillis();
        String evalJson = aiProvider.generateStructuredEvaluation(
                session.getProblemTitle(),
                session.getTargetLevel(),
                history
        );
        long latency = System.currentTimeMillis() - startMs;

        usageLogRepository.save(new AiUsageLog(userId, "INTERVIEW_EVALUATION", "gemini-2.5-flash", 1200, 450, (int) latency));

        BigDecimal overallScore = BigDecimal.valueOf(85.0);
        String categoryScores = "{}";
        String strengths = "[]";
        String weaknesses = "[]";
        String missingConcepts = "[]";
        String incorrectAssumptions = "[]";
        String suggestedImprovements = "[]";
        String idealAnswer = "Comprehensive end-to-end distributed system architecture.";
        String recommendedTopics = "[]";

        try {
            JsonNode root = objectMapper.readTree(evalJson);
            if (root.has("overallScore")) {
                overallScore = BigDecimal.valueOf(root.path("overallScore").asDouble(85.0));
            }
            if (root.has("categoryScores")) {
                categoryScores = root.path("categoryScores").toString();
            }
            if (root.has("strengths")) {
                strengths = root.path("strengths").toString();
            }
            if (root.has("weaknesses")) {
                weaknesses = root.path("weaknesses").toString();
            }
            if (root.has("missingConcepts")) {
                missingConcepts = root.path("missingConcepts").toString();
            }
            if (root.has("incorrectAssumptions")) {
                incorrectAssumptions = root.path("incorrectAssumptions").toString();
            }
            if (root.has("suggestedImprovements")) {
                suggestedImprovements = root.path("suggestedImprovements").toString();
            }
            if (root.has("idealAnswerOutline")) {
                idealAnswer = root.path("idealAnswerOutline").asText();
            }
            if (root.has("recommendedTopics")) {
                recommendedTopics = root.path("recommendedTopics").toString();
            }
        } catch (Exception e) {
            // Fallback to default
        }

        InterviewEvaluation eval = new InterviewEvaluation(session, overallScore, categoryScores, idealAnswer);
        eval.setStrengths(strengths);
        eval.setWeaknesses(weaknesses);
        eval.setMissingConcepts(missingConcepts);
        eval.setIncorrectAssumptions(incorrectAssumptions);
        eval.setSuggestedImprovements(suggestedImprovements);
        eval.setRecommendedTopics(recommendedTopics);

        evaluationRepository.save(eval);
        session.setEvaluation(eval);
        sessionRepository.save(session);

        return getSessionById(userId, sessionId);
    }

    @Transactional
    public void pauseSession(UUID userId, UUID sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));
        session.setStatus("PAUSED");
        sessionRepository.save(session);
    }

    @Transactional
    public void resumeSession(UUID userId, UUID sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));
        session.setStatus("IN_PROGRESS");
        sessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public InterviewSessionDto getSessionById(UUID userId, UUID sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found: " + sessionId));

        List<InterviewMessageDto> messageDtos = messageRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId)
                .stream().map(this::toMessageDto).collect(Collectors.toList());

        InterviewEvaluationDto evalDto = null;
        Optional<InterviewEvaluation> eval = evaluationRepository.findBySessionId(sessionId);
        if (eval.isPresent()) {
            evalDto = toEvaluationDto(eval.get());
        }

        return new InterviewSessionDto(
                session.getId(),
                session.getUserId(),
                session.getCategory(),
                session.getTargetLevel(),
                session.getInterviewerPersona(),
                session.getProblemTitle(),
                session.getStatus(),
                session.getCurrentStage(),
                session.getStartedAt(),
                session.getCompletedAt(),
                session.getDurationSeconds(),
                messageDtos,
                evalDto
        );
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionDto> getUserSessions(UUID userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::toSessionDto)
                .collect(Collectors.toList());
    }

    private InterviewSessionDto toSessionDto(InterviewSession session) {
        List<InterviewMessageDto> msgs = session.getMessages().stream()
                .map(this::toMessageDto)
                .collect(Collectors.toList());

        InterviewEvaluationDto evalDto = session.getEvaluation() != null
                ? toEvaluationDto(session.getEvaluation())
                : null;

        return new InterviewSessionDto(
                session.getId(),
                session.getUserId(),
                session.getCategory(),
                session.getTargetLevel(),
                session.getInterviewerPersona(),
                session.getProblemTitle(),
                session.getStatus(),
                session.getCurrentStage(),
                session.getStartedAt(),
                session.getCompletedAt(),
                session.getDurationSeconds(),
                msgs,
                evalDto
        );
    }

    private InterviewMessageDto toMessageDto(InterviewMessage m) {
        return new InterviewMessageDto(
                m.getId(),
                m.getSenderRole(),
                m.getStepStage(),
                m.getContent(),
                m.getSequenceOrder(),
                m.getCreatedAt()
        );
    }

    private InterviewEvaluationDto toEvaluationDto(InterviewEvaluation e) {
        return new InterviewEvaluationDto(
                e.getId(),
                e.getSession().getId(),
                e.getOverallScore(),
                e.getCategoryScores(),
                e.getStrengths(),
                e.getWeaknesses(),
                e.getMissingConcepts(),
                e.getIncorrectAssumptions(),
                e.getSuggestedImprovements(),
                e.getIdealAnswerOutline(),
                e.getRecommendedTopics()
        );
    }
}
