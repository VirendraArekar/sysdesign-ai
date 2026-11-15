package com.sysdesign.modules.curriculum.dto;

import java.util.List;

public record ModuleDto(
    String id,
    String title,
    String description,
    String icon,
    Integer sequenceOrder,
    Integer estimatedHours,
    Integer topicCount,
    List<TopicSummaryDto> topics
) {}
