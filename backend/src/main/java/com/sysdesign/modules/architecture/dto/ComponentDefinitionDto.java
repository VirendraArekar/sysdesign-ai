package com.sysdesign.modules.architecture.dto;

public class ComponentDefinitionDto {
    private String category;
    private String label;
    private String sub;
    private String techStack;
    private String color;
    private String defaultQps;
    private String defaultReplicas;
    private String description;

    public ComponentDefinitionDto() {}

    public ComponentDefinitionDto(String category, String label, String sub, String techStack, String color, String defaultQps, String defaultReplicas, String description) {
        this.category = category;
        this.label = label;
        this.sub = sub;
        this.techStack = techStack;
        this.color = color;
        this.defaultQps = defaultQps;
        this.defaultReplicas = defaultReplicas;
        this.description = description;
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

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDefaultQps() {
        return defaultQps;
    }

    public void setDefaultQps(String defaultQps) {
        this.defaultQps = defaultQps;
    }

    public String getDefaultReplicas() {
        return defaultReplicas;
    }

    public void setDefaultReplicas(String defaultReplicas) {
        this.defaultReplicas = defaultReplicas;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
