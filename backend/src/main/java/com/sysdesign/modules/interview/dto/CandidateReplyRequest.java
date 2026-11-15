package com.sysdesign.modules.interview.dto;

import jakarta.validation.constraints.NotBlank;

public record CandidateReplyRequest(
    @NotBlank(message = "Answer content cannot be empty")
    String content,

    Integer durationDeltaSeconds
) {}
