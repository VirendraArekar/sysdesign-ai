package com.sysdesign.modules.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Size(max = 120, message = "Full name must not exceed 120 characters")
    String fullName,

    @Size(max = 100, message = "Target role must not exceed 100 characters")
    String targetRole,

    @Min(value = 0, message = "Experience must be non-negative")
    @Max(value = 50, message = "Experience cannot exceed 50")
    Integer experienceYears,

    String[] targetCompanies,

    String preferredLevel
) {}
