package com.sysdesign.modules.architecture.dto;

import jakarta.validation.constraints.NotBlank;

public class NodeValidationRequest {
    @NotBlank
    private String category;
    @NotBlank
    private String label;
    private String techStack;
    private String qps;
    private String replicas;

    public NodeValidationRequest() {}

    public NodeValidationRequest(String category, String label, String techStack, String qps, String replicas) {
        this.category = category;
        this.label = label;
        this.techStack = techStack;
        this.qps = qps;
        this.replicas = replicas;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getQps() {
        return qps;
    }

    public void setQps(String qps) {
        this.qps = qps;
    }

    public String getReplicas() {
        return replicas;
    }

    public void setReplicas(String replicas) {
        this.replicas = replicas;
    }
}
