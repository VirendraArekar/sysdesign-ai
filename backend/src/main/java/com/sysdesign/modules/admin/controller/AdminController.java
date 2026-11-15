package com.sysdesign.modules.admin.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.modules.admin.dto.*;
import com.sysdesign.modules.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Management & Monetization", description = "Platform monitoring, AI token usage analytics, subscription tiers and user administration")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Get platform administrative overview: users, token consumption, subscriptions and memory")
    public ApiResponse<AdminOverviewResponse> getAdminOverview() {
        AdminOverviewResponse overview = adminService.getAdminOverview();
        return ApiResponse.ok("Admin overview metrics retrieved", overview);
    }

    @PostMapping("/users/{userId}/tier")
    @Operation(summary = "Upgrade or downgrade user subscription tier (FREE, PRO, ENTERPRISE)")
    public ApiResponse<UserManagementItem> updateUserTier(
            @PathVariable UUID userId,
            @Valid @RequestBody UserTierUpdateRequest request) {
        UserManagementItem updated = adminService.updateUserTier(userId, request.getPlanTier());
        return ApiResponse.ok("User subscription tier updated", updated);
    }

    @PostMapping("/users/{userId}/status")
    @Operation(summary = "Enable or disable user account access")
    public ApiResponse<UserManagementItem> toggleUserStatus(
            @PathVariable UUID userId,
            @RequestParam boolean active) {
        UserManagementItem updated = adminService.toggleUserStatus(userId, active);
        return ApiResponse.ok("User status updated", updated);
    }
}
