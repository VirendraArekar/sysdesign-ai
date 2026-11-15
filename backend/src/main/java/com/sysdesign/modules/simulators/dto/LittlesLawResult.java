package com.sysdesign.modules.simulators.dto;

public class LittlesLawResult {

    private double concurrentInFlightRequests;
    private int recommendedWorkerNodes;
    private double threadUtilizationPct;
    private String bottleneckWarning;

    public LittlesLawResult() {}

    public LittlesLawResult(double concurrentInFlightRequests, int recommendedWorkerNodes, double threadUtilizationPct, String bottleneckWarning) {
        this.concurrentInFlightRequests = concurrentInFlightRequests;
        this.recommendedWorkerNodes = recommendedWorkerNodes;
        this.threadUtilizationPct = threadUtilizationPct;
        this.bottleneckWarning = bottleneckWarning;
    }

    public double getConcurrentInFlightRequests() {
        return concurrentInFlightRequests;
    }

    public void setConcurrentInFlightRequests(double concurrentInFlightRequests) {
        this.concurrentInFlightRequests = concurrentInFlightRequests;
    }

    public int getRecommendedWorkerNodes() {
        return recommendedWorkerNodes;
    }

    public void setRecommendedWorkerNodes(int recommendedWorkerNodes) {
        this.recommendedWorkerNodes = recommendedWorkerNodes;
    }

    public double getThreadUtilizationPct() {
        return threadUtilizationPct;
    }

    public void setThreadUtilizationPct(double threadUtilizationPct) {
        this.threadUtilizationPct = threadUtilizationPct;
    }

    public String getBottleneckWarning() {
        return bottleneckWarning;
    }

    public void setBottleneckWarning(String bottleneckWarning) {
        this.bottleneckWarning = bottleneckWarning;
    }
}
