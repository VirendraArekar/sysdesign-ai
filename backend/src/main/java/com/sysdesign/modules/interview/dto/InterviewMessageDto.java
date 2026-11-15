package com.sysdesign.modules.interview.dto;

import java.time.Instant;
import java.util.UUID;

public record InterviewMessageDto(
    UUID id,
    String senderRole,
    String stepStage,
    String content,
    Integer sequenceOrder,
    Instant createdAt
) {}
