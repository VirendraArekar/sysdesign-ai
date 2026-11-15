package com.sysdesign.modules.curriculum.dto;

import java.util.List;

public record TopicSummaryDto(
    String id,
    String moduleId,
    String title,
    String summary,
    String difficulty,
    Integer sequenceOrder,
    List<String> subtopics
) {}
