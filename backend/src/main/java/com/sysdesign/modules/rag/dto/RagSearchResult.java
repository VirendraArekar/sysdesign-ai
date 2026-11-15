package com.sysdesign.modules.rag.dto;

public class RagSearchResult {

    private String id;
    private String title;
    private String category; // CURRICULUM, HLD, LLD
    private String moduleName;
    private String snippet;
    private double similarityScore; // 0.0 to 1.0
    private String targetUrl;

    public RagSearchResult() {}

    public RagSearchResult(String id, String title, String category, String moduleName, String snippet, double similarityScore, String targetUrl) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.moduleName = moduleName;
        this.snippet = snippet;
        this.similarityScore = similarityScore;
        this.targetUrl = targetUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public void setSimilarityScore(double similarityScore) {
        this.similarityScore = similarityScore;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }
}
