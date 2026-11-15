package com.sysdesign.modules.analytics.dto;

import java.util.List;
import java.util.Map;

public class DashboardMetricsResponse {

    private int readinessScore; // 0 - 100
    private String readinessLevel; // e.g., "Senior Engineer (L5)", "Staff Engineer (L6)", "Principal (L7)"
    private int currentStreakDays;
    private double totalHoursLearned;
    private int completedTopicsCount;
    private int totalTopicsCount;
    private int mockInterviewsCompleted;
    private double averageInterviewScore;
    private int architecturesDesignedCount;
    private List<Map<String, Object>> skillRadar; // category name, score (0-100), benchmark
    private List<Map<String, Object>> weeklyActivity; // day, hours, topics
    private List<Map<String, String>> recommendedNextSteps; // title, type, link, reason

    public DashboardMetricsResponse() {}

    public int getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(int readinessScore) {
        this.readinessScore = readinessScore;
    }

    public String getReadinessLevel() {
        return readinessLevel;
    }

    public void setReadinessLevel(String readinessLevel) {
        this.readinessLevel = readinessLevel;
    }

    public int getCurrentStreakDays() {
        return currentStreakDays;
    }

    public void setCurrentStreakDays(int currentStreakDays) {
        this.currentStreakDays = currentStreakDays;
    }

    public double getTotalHoursLearned() {
        return totalHoursLearned;
    }

    public void setTotalHoursLearned(double totalHoursLearned) {
        this.totalHoursLearned = totalHoursLearned;
    }

    public int getCompletedTopicsCount() {
        return completedTopicsCount;
    }

    public void setCompletedTopicsCount(int completedTopicsCount) {
        this.completedTopicsCount = completedTopicsCount;
    }

    public int getTotalTopicsCount() {
        return totalTopicsCount;
    }

    public void setTotalTopicsCount(int totalTopicsCount) {
        this.totalTopicsCount = totalTopicsCount;
    }

    public int getMockInterviewsCompleted() {
        return mockInterviewsCompleted;
    }

    public void setMockInterviewsCompleted(int mockInterviewsCompleted) {
        this.mockInterviewsCompleted = mockInterviewsCompleted;
    }

    public double getAverageInterviewScore() {
        return averageInterviewScore;
    }

    public void setAverageInterviewScore(double averageInterviewScore) {
        this.averageInterviewScore = averageInterviewScore;
    }

    public int getArchitecturesDesignedCount() {
        return architecturesDesignedCount;
    }

    public void setArchitecturesDesignedCount(int architecturesDesignedCount) {
        this.architecturesDesignedCount = architecturesDesignedCount;
    }

    public List<Map<String, Object>> getSkillRadar() {
        return skillRadar;
    }

    public void setSkillRadar(List<Map<String, Object>> skillRadar) {
        this.skillRadar = skillRadar;
    }

    public List<Map<String, Object>> getWeeklyActivity() {
        return weeklyActivity;
    }

    public void setWeeklyActivity(List<Map<String, Object>> weeklyActivity) {
        this.weeklyActivity = weeklyActivity;
    }

    public List<Map<String, String>> getRecommendedNextSteps() {
        return recommendedNextSteps;
    }

    public void setRecommendedNextSteps(List<Map<String, String>> recommendedNextSteps) {
        this.recommendedNextSteps = recommendedNextSteps;
    }
}
