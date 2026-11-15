package com.sysdesign.modules.architecture.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class AiAuditRequest {

    private String title;
    private String systemGoal;
    private String targetQps;

    @NotBlank(message = "Canvas data cannot be empty")
    private String canvasData;

    public AiAuditRequest() {}

    public AiAuditRequest(String title, String systemGoal, String targetQps, String canvasData) {
        this.title = title;
        this.systemGoal = systemGoal;
        this.targetQps = targetQps;
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

    public String getTargetQps() {
        return targetQps;
    }

    public void setTargetQps(String targetQps) {
        this.targetQps = targetQps;
    }

    public String getCanvasData() {
        return canvasData;
    }

    public void setCanvasData(String canvasData) {
        this.canvasData = canvasData;
    }
}
