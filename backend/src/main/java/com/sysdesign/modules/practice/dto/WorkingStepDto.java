package com.sysdesign.modules.practice.dto;

public record WorkingStepDto(
    int stepNumber,
    String component,
    String action,
    String protocol,
    String latency,
    String interviewerTalkingPoint
) {}
