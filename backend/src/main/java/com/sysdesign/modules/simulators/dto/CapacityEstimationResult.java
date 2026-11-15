package com.sysdesign.modules.simulators.dto;

public class CapacityEstimationResult {

    private double avgQps;
    private double peakQps;
    private double readQps;
    private double writeQps;
    private double dailyStorageGb;
    private double fiveYearStorageTb;
    private double ingressBandwidthMbps;
    private double egressBandwidthMbps;
    private double recommendedCacheRamGb; // 20% of daily read data

    public CapacityEstimationResult() {}

    public double getAvgQps() {
        return avgQps;
    }

    public void setAvgQps(double avgQps) {
        this.avgQps = avgQps;
    }

    public double getPeakQps() {
        return peakQps;
    }

    public void setPeakQps(double peakQps) {
        this.peakQps = peakQps;
    }

    public double getReadQps() {
        return readQps;
    }

    public void setReadQps(double readQps) {
        this.readQps = readQps;
    }

    public double getWriteQps() {
        return writeQps;
    }

    public void setWriteQps(double writeQps) {
        this.writeQps = writeQps;
    }

    public double getDailyStorageGb() {
        return dailyStorageGb;
    }

    public void setDailyStorageGb(double dailyStorageGb) {
        this.dailyStorageGb = dailyStorageGb;
    }

    public double getFiveYearStorageTb() {
        return fiveYearStorageTb;
    }

    public void setFiveYearStorageTb(double fiveYearStorageTb) {
        this.fiveYearStorageTb = fiveYearStorageTb;
    }

    public double getIngressBandwidthMbps() {
        return ingressBandwidthMbps;
    }

    public void setIngressBandwidthMbps(double ingressBandwidthMbps) {
        this.ingressBandwidthMbps = ingressBandwidthMbps;
    }

    public double getEgressBandwidthMbps() {
        return egressBandwidthMbps;
    }

    public void setEgressBandwidthMbps(double egressBandwidthMbps) {
        this.egressBandwidthMbps = egressBandwidthMbps;
    }

    public double getRecommendedCacheRamGb() {
        return recommendedCacheRamGb;
    }

    public void setRecommendedCacheRamGb(double recommendedCacheRamGb) {
        this.recommendedCacheRamGb = recommendedCacheRamGb;
    }
}
