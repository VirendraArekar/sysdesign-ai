package com.sysdesign.modules.curriculum.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProgressRequest(
    @NotBlank(message = "Topic ID is required")
    String topicId,

    @NotBlank(message = "Status is required (NOT_STARTED, IN_PROGRESS, COMPLETED)")
    String status,

    Integer timeSpentSeconds
) {}
