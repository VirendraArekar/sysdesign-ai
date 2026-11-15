package com.sysdesign.modules.curriculum.dto;

import jakarta.validation.constraints.NotBlank;

public record SaveNoteRequest(
    @NotBlank(message = "Item type is required")
    String itemType,

    @NotBlank(message = "Item ID is required")
    String itemId,

    @NotBlank(message = "Content cannot be blank")
    String content
) {}
