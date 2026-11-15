package com.sysdesign.modules.practice.dto;

public record HldDetailDto(
    String id,
    String title,
    String category,
    String difficulty,
    String description,
    String functionalRequirements,
    String nonFunctionalRequirements,
    String capacityEstimation,
    String apiDesign,
    String databaseSchema,
    String architectureDiagramMermaid,
    String deepDiveTopics,
    String tradeOffs
) {}
