package com.sysdesign.modules.simulators.dto;

import jakarta.validation.constraints.Min;

public class CapacityEstimationRequest {

    @Min(value = 1, message = "DAU must be at least 1")
    private long dailyActiveUsers = 50_000_000;

    @Min(value = 1, message = "Actions per user must be at least 1")
    private int actionsPerUser = 20;

    private double readWriteRatio = 10.0; // 10 reads per 1 write
    private double peakTrafficMultiplier = 2.5; // Peak vs average
    private int avgPayloadBytes = 2048; // 2 KB
    private int retentionYears = 5;
    private int replicationFactor = 3;

    public CapacityEstimationRequest() {}

    public long getDailyActiveUsers() {
        return dailyActiveUsers;
    }

    public void setDailyActiveUsers(long dailyActiveUsers) {
        this.dailyActiveUsers = dailyActiveUsers;
    }

    public int getActionsPerUser() {
        return actionsPerUser;
    }

    public void setActionsPerUser(int actionsPerUser) {
        this.actionsPerUser = actionsPerUser;
    }

    public double getReadWriteRatio() {
        return readWriteRatio;
    }

    public void setReadWriteRatio(double readWriteRatio) {
        this.readWriteRatio = readWriteRatio;
    }

    public double getPeakTrafficMultiplier() {
        return peakTrafficMultiplier;
    }

    public void setPeakTrafficMultiplier(double peakTrafficMultiplier) {
        this.peakTrafficMultiplier = peakTrafficMultiplier;
    }

    public int getAvgPayloadBytes() {
        return avgPayloadBytes;
    }

    public void setAvgPayloadBytes(int avgPayloadBytes) {
        this.avgPayloadBytes = avgPayloadBytes;
    }

    public int getRetentionYears() {
        return retentionYears;
    }

    public void setRetentionYears(int retentionYears) {
        this.retentionYears = retentionYears;
    }

    public int getReplicationFactor() {
        return replicationFactor;
    }

    public void setReplicationFactor(int replicationFactor) {
        this.replicationFactor = replicationFactor;
    }
}
