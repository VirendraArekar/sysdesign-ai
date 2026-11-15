package com.sysdesign.modules.interview;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sysdesign.modules.ai.repository.AiUsageLogRepository;
import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.interview.dto.CandidateReplyRequest;
import com.sysdesign.modules.interview.dto.InterviewSessionDto;
import com.sysdesign.modules.interview.dto.StartInterviewRequest;
import com.sysdesign.modules.interview.model.InterviewMessage;
import com.sysdesign.modules.interview.model.InterviewSession;
import com.sysdesign.modules.interview.repository.InterviewEvaluationRepository;
import com.sysdesign.modules.interview.repository.InterviewMessageRepository;
import com.sysdesign.modules.interview.repository.InterviewSessionRepository;
import com.sysdesign.modules.interview.service.InterviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;
    @Mock
    private InterviewMessageRepository messageRepository;
    @Mock
    private InterviewEvaluationRepository evaluationRepository;
    @Mock
    private AiUsageLogRepository usageLogRepository;
    @Mock
    private AiProvider aiProvider;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private InterviewService interviewService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        interviewService = new InterviewService(
                sessionRepository,
                messageRepository,
                evaluationRepository,
                usageLogRepository,
                aiProvider,
                messagingTemplate,
                objectMapper
        );
    }

    @Test
    void startSessionCreatesSessionAndFirstQuestion() {
        UUID userId = UUID.randomUUID();
        StartInterviewRequest request = new StartInterviewRequest("HLD", "STAFF", "STAFF_ENGINEER", "Design TinyURL");

        InterviewSession mockSession = new InterviewSession(userId, "HLD", "STAFF", "STAFF_ENGINEER", "Design TinyURL");
        mockSession.setId(UUID.randomUUID());

        when(sessionRepository.save(any(InterviewSession.class))).thenReturn(mockSession);
        when(messageRepository.save(any(InterviewMessage.class))).thenAnswer(i -> i.getArgument(0));

        InterviewSessionDto result = interviewService.startSession(userId, request);
        assertNotNull(result);
        assertEquals("Design TinyURL", result.problemTitle());
        assertEquals("STAFF", result.targetLevel());
        verify(sessionRepository, times(1)).save(any(InterviewSession.class));
        verify(messageRepository, times(1)).save(any(InterviewMessage.class));
    }

    @Test
    void submitCandidateReplyGeneratesAiFollowUp() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        InterviewSession mockSession = new InterviewSession(userId, "HLD", "STAFF", "STAFF_ENGINEER", "Design TinyURL");
        mockSession.setId(sessionId);
        mockSession.setCurrentStage("REQUIREMENTS");

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));
        when(messageRepository.findBySessionIdOrderBySequenceOrderAsc(sessionId)).thenReturn(new ArrayList<>());
        when(aiProvider.generateFollowUpQuestion(any(), any(), any(), any()))
                .thenReturn("How do you size the Redis cache for hot keys?");

        CandidateReplyRequest reply = new CandidateReplyRequest("We will have 100M daily active users.", 15);
        InterviewSessionDto updated = interviewService.submitCandidateReply(userId, sessionId, reply);

        assertNotNull(updated);
        verify(messageRepository, times(2)).save(any(InterviewMessage.class)); // 1 candidate + 1 interviewer
        verify(aiProvider, times(1)).generateFollowUpQuestion(any(), any(), any(), any());
    }
}
