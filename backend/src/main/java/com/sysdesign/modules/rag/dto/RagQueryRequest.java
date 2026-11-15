package com.sysdesign.modules.rag.dto;

import jakarta.validation.constraints.NotBlank;

public class RagQueryRequest {

    @NotBlank(message = "Query cannot be empty")
    private String query;

    private int topK = 5;
    private String categoryFilter; // e.g. "CURRICULUM", "HLD", "LLD", "ALL"

    public RagQueryRequest() {}

    public RagQueryRequest(String query, int topK, String categoryFilter) {
        this.query = query;
        this.topK = topK;
        this.categoryFilter = categoryFilter;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getTopK() {
        return topK;
    }

    public void setTopK(int topK) {
        this.topK = topK;
    }

    public String getCategoryFilter() {
        return categoryFilter;
    }

    public void setCategoryFilter(String categoryFilter) {
        this.categoryFilter = categoryFilter;
    }
}
