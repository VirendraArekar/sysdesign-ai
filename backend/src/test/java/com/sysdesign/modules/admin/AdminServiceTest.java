package com.sysdesign.modules.admin;

import com.sysdesign.modules.admin.dto.AdminOverviewResponse;
import com.sysdesign.modules.admin.dto.UserManagementItem;
import com.sysdesign.modules.admin.model.Subscription;
import com.sysdesign.modules.admin.repository.SubscriptionRepository;
import com.sysdesign.modules.admin.service.AdminService;
import com.sysdesign.modules.ai.repository.AiUsageLogRepository;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private AiUsageLogRepository aiUsageLogRepository;

    private AdminService adminService;
    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        adminService = new AdminService(userRepository, subscriptionRepository, aiUsageLogRepository);
        userId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(userId);
        testUser.setEmail("staff@example.com");
        testUser.setFullName("Staff Candidate");
        testUser.setActive(true);
    }

    @Test
    void testGetAdminOverview() {
        when(userRepository.count()).thenReturn(25L);
        when(subscriptionRepository.countByPlanTier("PRO")).thenReturn(10L);
        when(subscriptionRepository.countByPlanTier("ENTERPRISE")).thenReturn(3L);
        when(aiUsageLogRepository.sumTotalTokensSystemWide()).thenReturn(350_000L);
        when(userRepository.findAll()).thenReturn(List.of(testUser));
        when(subscriptionRepository.findByUserId(userId)).thenReturn(Optional.empty());

        AdminOverviewResponse overview = adminService.getAdminOverview();

        assertNotNull(overview);
        assertEquals(25L, overview.getTotalUsers());
        assertEquals(13L, overview.getActiveSubscriptions());
        assertEquals(10L, overview.getProSubscribers());
        assertEquals(3L, overview.getEnterpriseSubscribers());
        assertEquals(12L, overview.getFreeTierUsers());
        assertEquals(350_000L, overview.getTotalAiTokensUsed());
        assertFalse(overview.getCandidates().isEmpty());
    }

    @Test
    void testUpdateUserTier() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(subscriptionRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(i -> i.getArgument(0));

        UserManagementItem item = adminService.updateUserTier(userId, "PRO");

        assertNotNull(item);
        assertEquals("PRO", item.getPlanTier());
        assertEquals(500_000, item.getDailyTokenQuota());
    }

    @Test
    void testToggleUserStatus() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(subscriptionRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserManagementItem item = adminService.toggleUserStatus(userId, false);

        assertNotNull(item);
        assertFalse(item.isActive());
    }
}
