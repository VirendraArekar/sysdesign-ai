package com.sysdesign.modules.auth.dto;

public record AuthResponse(
    String token,
    String refreshToken,
    UserDto user
) {}
