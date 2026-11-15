package com.sysdesign.modules.architecture.dto;

import jakarta.validation.constraints.NotBlank;

public class AiExplainRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String systemGoal;

    private String targetScale = "100k QPS";

    @NotBlank(message = "Canvas data is required")
    private String canvasData;

    public AiExplainRequest() {}

    public AiExplainRequest(String title, String systemGoal, String targetScale, String canvasData) {
        this.title = title;
        this.systemGoal = systemGoal;
        this.targetScale = targetScale;
        this.canvasData = canvasData;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSystemGoal() {
        return systemGoal;
    }

    public void setSystemGoal(String systemGoal) {
        this.systemGoal = systemGoal;
    }

    public String getTargetScale() {
        return targetScale;
    }

    public void setTargetScale(String targetScale) {
        this.targetScale = targetScale;
    }

    public String getCanvasData() {
        return canvasData;
    }

    public void setCanvasData(String canvasData) {
        this.canvasData = canvasData;
    }
}
