package com.sysdesign.modules.practice.dto;

import java.util.List;

public record TopicHubDetailDto(
    String id,
    String title,
    String type, // "HLD" or "LLD"
    String category,
    String difficulty,
    String description,
    String systemDesignDiagram,
    String umlClassDiagram,
    String umlSequenceDiagram,
    CodeOptionsDto codeOptions,
    List<WorkingStepDto> workingSteps,
    List<RelatedAnswerDto> relatedAnswers,
    List<String> deepDiveTopics,
    List<String> tradeOffs
) {}
