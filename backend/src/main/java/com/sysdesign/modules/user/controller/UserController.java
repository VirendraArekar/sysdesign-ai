package com.sysdesign.modules.user.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.common.security.UserPrincipal;
import com.sysdesign.modules.auth.dto.UserDto;
import com.sysdesign.modules.user.dto.UpdateProfileRequest;
import com.sysdesign.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "User profile and settings endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile details")
    public ApiResponse<UserDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(principal.getId(), request);
        return ApiResponse.ok("Profile updated successfully", updated);
    }
}
