package com.sysdesign.modules.practice.dto;

import java.util.List;

public record TopicHubSummaryDto(
    String id,
    String title,
    String type, // "HLD" or "LLD"
    String category,
    String difficulty,
    String summary,
    List<String> tags
) {}
