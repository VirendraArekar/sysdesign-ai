package com.sysdesign.modules.analytics;

import com.sysdesign.modules.analytics.dto.DashboardMetricsResponse;
import com.sysdesign.modules.analytics.service.AnalyticsService;
import com.sysdesign.modules.architecture.repository.ArchitectureDiagramRepository;
import com.sysdesign.modules.curriculum.repository.LearningProgressRepository;
import com.sysdesign.modules.curriculum.repository.TopicRepository;
import com.sysdesign.modules.interview.repository.InterviewSessionRepository;
import com.sysdesign.modules.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private LearningProgressRepository progressRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private ArchitectureDiagramRepository diagramRepository;

    private AnalyticsService analyticsService;
    private UUID userId;

    @BeforeEach
    void setUp() {
        analyticsService = new AnalyticsService(userProfileRepository, progressRepository, topicRepository, sessionRepository, diagramRepository);
        userId = UUID.randomUUID();
    }

    @Test
    void testGetDashboardMetrics() {
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(progressRepository.countByUserIdAndStatus(userId, "COMPLETED")).thenReturn(12L);
        when(topicRepository.count()).thenReturn(40L);
        when(sessionRepository.findByUserIdOrderByStartedAtDesc(userId)).thenReturn(Collections.emptyList());
        when(diagramRepository.findByUserIdOrderByUpdatedAtDesc(userId)).thenReturn(Collections.emptyList());

        DashboardMetricsResponse response = analyticsService.getDashboardMetrics(userId);

        assertNotNull(response);
        assertTrue(response.getReadinessScore() >= 45 && response.getReadinessScore() <= 100);
        assertNotNull(response.getReadinessLevel());
        assertEquals(12, response.getCompletedTopicsCount());
        assertEquals(40, response.getTotalTopicsCount());
        assertFalse(response.getSkillRadar().isEmpty());
        assertFalse(response.getWeeklyActivity().isEmpty());
        assertFalse(response.getRecommendedNextSteps().isEmpty());
    }
}
