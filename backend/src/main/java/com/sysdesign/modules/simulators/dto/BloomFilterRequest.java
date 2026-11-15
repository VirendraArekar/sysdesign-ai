package com.sysdesign.modules.simulators.dto;

public class BloomFilterRequest {

    private long expectedItems = 10_000_000;
    private double desiredFalsePositiveRate = 0.01; // 1%

    public BloomFilterRequest() {}

    public BloomFilterRequest(long expectedItems, double desiredFalsePositiveRate) {
        this.expectedItems = expectedItems;
        this.desiredFalsePositiveRate = desiredFalsePositiveRate;
    }

    public long getExpectedItems() {
        return expectedItems;
    }

    public void setExpectedItems(long expectedItems) {
        this.expectedItems = expectedItems;
    }

    public double getDesiredFalsePositiveRate() {
        return desiredFalsePositiveRate;
    }

    public void setDesiredFalsePositiveRate(double desiredFalsePositiveRate) {
        this.desiredFalsePositiveRate = desiredFalsePositiveRate;
    }
}
