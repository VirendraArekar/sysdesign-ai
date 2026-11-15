package com.sysdesign.modules.architecture.dto;

public class AiGenerateResponse {

    private String title;
    private String description;
    private String canvasData;
    private String architecturalRationale;

    public AiGenerateResponse() {}

    public AiGenerateResponse(String title, String description, String canvasData, String architecturalRationale) {
        this.title = title;
        this.description = description;
        this.canvasData = canvasData;
        this.architecturalRationale = architecturalRationale;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCanvasData() {
        return canvasData;
    }

    public void setCanvasData(String canvasData) {
        this.canvasData = canvasData;
    }

    public String getArchitecturalRationale() {
        return architecturalRationale;
    }

    public void setArchitecturalRationale(String architecturalRationale) {
        this.architecturalRationale = architecturalRationale;
    }
}
