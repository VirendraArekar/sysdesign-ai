package com.sysdesign.modules.practice.dto;

public record LldDetailDto(
    String id,
    String title,
    String difficulty,
    String problemStatement,
    String solidPrinciplesApplied,
    String designPatternsUsed,
    String classDiagramMermaid,
    String javaSolutionCode,
    String unitTestsCode,
    String extensibilityNotes
) {}
