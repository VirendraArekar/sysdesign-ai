package com.sysdesign.modules.architecture.dto;

import java.util.List;

public class NodeValidationResponse {
    private boolean valid;
    private String category;
    private String label;
    private String suggestedTech;
    private List<String> recommendedConnections;
    private String resilienceTip;

    public NodeValidationResponse() {}

    public NodeValidationResponse(boolean valid, String category, String label, String suggestedTech, List<String> recommendedConnections, String resilienceTip) {
        this.valid = valid;
        this.category = category;
        this.label = label;
        this.suggestedTech = suggestedTech;
        this.recommendedConnections = recommendedConnections;
        this.resilienceTip = resilienceTip;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
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

    public String getSuggestedTech() {
        return suggestedTech;
    }

    public void setSuggestedTech(String suggestedTech) {
        this.suggestedTech = suggestedTech;
    }

    public List<String> getRecommendedConnections() {
        return recommendedConnections;
    }

    public void setRecommendedConnections(List<String> recommendedConnections) {
        this.recommendedConnections = recommendedConnections;
    }

    public String getResilienceTip() {
        return resilienceTip;
    }

    public void setResilienceTip(String resilienceTip) {
        this.resilienceTip = resilienceTip;
    }
}
