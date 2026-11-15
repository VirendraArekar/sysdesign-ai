package com.sysdesign.modules.rag.dto;

import java.util.List;

public class RagAnswerResponse {

    private String query;
    private String answer;
    private double confidenceScore;
    private List<RagSearchResult> citedSources;

    public RagAnswerResponse() {}

    public RagAnswerResponse(String query, String answer, double confidenceScore, List<RagSearchResult> citedSources) {
        this.query = query;
        this.answer = answer;
        this.confidenceScore = confidenceScore;
        this.citedSources = citedSources;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public List<RagSearchResult> getCitedSources() {
        return citedSources;
    }

    public void setCitedSources(List<RagSearchResult> citedSources) {
        this.citedSources = citedSources;
    }
}
