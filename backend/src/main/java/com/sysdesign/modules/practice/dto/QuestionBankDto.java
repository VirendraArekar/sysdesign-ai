package com.sysdesign.modules.practice.dto;

import java.util.UUID;

public record QuestionBankDto(
    UUID id,
    String title,
    String category,
    String difficulty,
    String[] companyTags,
    boolean verifiedPublic,
    String questionText,
    String modelAnswer,
    String keyPoints
) {}
