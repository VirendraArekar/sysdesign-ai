package com.sysdesign.modules.interview.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record InterviewEvaluationDto(
    UUID id,
    UUID sessionId,
    BigDecimal overallScore,
    String categoryScores,
    String strengths,
    String weaknesses,
    String missingConcepts,
    String incorrectAssumptions,
    String suggestedImprovements,
    String idealAnswerOutline,
    String recommendedTopics
) {}
