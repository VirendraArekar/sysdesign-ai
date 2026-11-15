package com.sysdesign.modules.analytics.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.common.security.UserPrincipal;
import com.sysdesign.modules.analytics.dto.DashboardMetricsResponse;
import com.sysdesign.modules.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Analytics & Learning Dashboard", description = "Candidate readiness score, 15-category skill radar, activity heatmap and personalized recommendations")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive learning analytics and readiness score for candidate")
    public ApiResponse<DashboardMetricsResponse> getDashboardMetrics(@AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : UUID.randomUUID();
        DashboardMetricsResponse metrics = analyticsService.getDashboardMetrics(userId);
        return ApiResponse.ok("Dashboard metrics retrieved", metrics);
    }
}
