package com.sysdesign.modules.practice.dto;

import java.util.List;

public record RelatedAnswerDto(
    String question,
    String interviewerIntent,
    String modelAnswer,
    List<String> keyPoints,
    String tradeOffs,
    String edgeCases
) {}
