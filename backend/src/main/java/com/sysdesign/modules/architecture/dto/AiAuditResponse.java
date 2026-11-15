package com.sysdesign.modules.architecture.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AiAuditResponse {

    private int healthScore;
    private String scalabilityRating;
    private String architectureSummary;
    private List<Map<String, Object>> singlePointsOfFailure = new ArrayList<>();
    private List<Map<String, Object>> bottlenecks = new ArrayList<>();
    private List<Map<String, Object>> securityRisks = new ArrayList<>();
    private String dataConsistencyAnalysis;
    private List<String> recommendations = new ArrayList<>();

    public AiAuditResponse() {}

    public int getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(int healthScore) {
        this.healthScore = healthScore;
    }

    public String getScalabilityRating() {
        return scalabilityRating;
    }

    public void setScalabilityRating(String scalabilityRating) {
        this.scalabilityRating = scalabilityRating;
    }

    public String getArchitectureSummary() {
        return architectureSummary;
    }

    public void setArchitectureSummary(String architectureSummary) {
        this.architectureSummary = architectureSummary;
    }

    public List<Map<String, Object>> getSinglePointsOfFailure() {
        return singlePointsOfFailure;
    }

    public void setSinglePointsOfFailure(List<Map<String, Object>> singlePointsOfFailure) {
        this.singlePointsOfFailure = singlePointsOfFailure;
    }

    public List<Map<String, Object>> getBottlenecks() {
        return bottlenecks;
    }

    public void setBottlenecks(List<Map<String, Object>> bottlenecks) {
        this.bottlenecks = bottlenecks;
    }

    public List<Map<String, Object>> getSecurityRisks() {
        return securityRisks;
    }

    public void setSecurityRisks(List<Map<String, Object>> securityRisks) {
        this.securityRisks = securityRisks;
    }

    public String getDataConsistencyAnalysis() {
        return dataConsistencyAnalysis;
    }

    public void setDataConsistencyAnalysis(String dataConsistencyAnalysis) {
        this.dataConsistencyAnalysis = dataConsistencyAnalysis;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
