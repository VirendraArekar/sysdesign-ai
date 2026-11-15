package com.sysdesign.modules.practice.dto;

public record LldSummaryDto(
    String id,
    String title,
    String difficulty,
    String problemStatement,
    String solidPrinciplesApplied,
    String designPatternsUsed
) {}
