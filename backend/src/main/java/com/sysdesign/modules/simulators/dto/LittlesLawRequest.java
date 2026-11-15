package com.sysdesign.modules.simulators.dto;

public class LittlesLawRequest {

    private double arrivalRateRps = 10_000;
    private double avgLatencyMs = 50.0;
    private int threadPoolCapacityPerNode = 200;

    public LittlesLawRequest() {}

    public LittlesLawRequest(double arrivalRateRps, double avgLatencyMs, int threadPoolCapacityPerNode) {
        this.arrivalRateRps = arrivalRateRps;
        this.avgLatencyMs = avgLatencyMs;
        this.threadPoolCapacityPerNode = threadPoolCapacityPerNode;
    }

    public double getArrivalRateRps() {
        return arrivalRateRps;
    }

    public void setArrivalRateRps(double arrivalRateRps) {
        this.arrivalRateRps = arrivalRateRps;
    }

    public double getAvgLatencyMs() {
        return avgLatencyMs;
    }

    public void setAvgLatencyMs(double avgLatencyMs) {
        this.avgLatencyMs = avgLatencyMs;
    }

    public int getThreadPoolCapacityPerNode() {
        return threadPoolCapacityPerNode;
    }

    public void setThreadPoolCapacityPerNode(int threadPoolCapacityPerNode) {
        this.threadPoolCapacityPerNode = threadPoolCapacityPerNode;
    }
}
