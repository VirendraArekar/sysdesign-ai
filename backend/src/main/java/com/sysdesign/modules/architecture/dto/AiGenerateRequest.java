package com.sysdesign.modules.architecture.dto;

import jakarta.validation.constraints.NotBlank;

public class AiGenerateRequest {

    @NotBlank(message = "Prompt cannot be empty")
    private String prompt;

    private String targetScale;
    private String style; // e.g. "MICROSERVICES", "EVENT_DRIVEN", "MODULAR_MONOLITH"

    public AiGenerateRequest() {}

    public AiGenerateRequest(String prompt, String targetScale, String style) {
        this.prompt = prompt;
        this.targetScale = targetScale;
        this.style = style;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getTargetScale() {
        return targetScale;
    }

    public void setTargetScale(String targetScale) {
        this.targetScale = targetScale;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }
}
