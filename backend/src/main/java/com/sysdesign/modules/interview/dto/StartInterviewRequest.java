package com.sysdesign.modules.interview.dto;

import jakarta.validation.constraints.NotBlank;

public record StartInterviewRequest(
    @NotBlank(message = "Category is required (HLD, LLD, DISTRIBUTED_SYSTEMS)")
    String category,

    @NotBlank(message = "Target level is required (BEGINNER, SENIOR, STAFF, PRINCIPAL)")
    String targetLevel,

    String interviewerPersona, // STAFF_ENGINEER, PRINCIPAL_ARCHITECT, SRE_LEAD

    @NotBlank(message = "Problem title is required")
    String problemTitle
) {}
