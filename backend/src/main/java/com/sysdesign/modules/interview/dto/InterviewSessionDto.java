package com.sysdesign.modules.interview.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewSessionDto(
    UUID id,
    UUID userId,
    String category,
    String targetLevel,
    String interviewerPersona,
    String problemTitle,
    String status,
    String currentStage,
    Instant startedAt,
    Instant completedAt,
    Integer durationSeconds,
    List<InterviewMessageDto> messages,
    InterviewEvaluationDto evaluation
) {}
