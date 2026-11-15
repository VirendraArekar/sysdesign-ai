package com.sysdesign.modules.architecture.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class DiagramSaveRequest {

    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Canvas data cannot be empty")
    private String canvasData;

    private String aiReview;

    public DiagramSaveRequest() {}

    public DiagramSaveRequest(UUID id, String title, String description, String canvasData, String aiReview) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.canvasData = canvasData;
        this.aiReview = aiReview;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getAiReview() {
        return aiReview;
    }

    public void setAiReview(String aiReview) {
        this.aiReview = aiReview;
    }
}
