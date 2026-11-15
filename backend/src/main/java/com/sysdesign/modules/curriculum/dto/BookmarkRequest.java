package com.sysdesign.modules.curriculum.dto;

import jakarta.validation.constraints.NotBlank;

public record BookmarkRequest(
    @NotBlank(message = "Item type is required (TOPIC, HLD_PROBLEM, LLD_PROBLEM, QUESTION)")
    String itemType,

    @NotBlank(message = "Item ID is required")
    String itemId
) {}
