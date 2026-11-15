package com.sysdesign.modules.auth.dto;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String fullName,
    String avatarUrl,
    Set<String> roles,
    String targetRole,
    Integer experienceYears,
    String[] targetCompanies,
    String preferredLevel,
    BigDecimal interviewReadinessScore,
    Integer dailyStreak
) {}
