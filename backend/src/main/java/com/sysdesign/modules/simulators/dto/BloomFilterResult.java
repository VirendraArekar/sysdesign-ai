package com.sysdesign.modules.simulators.dto;

public class BloomFilterResult {

    private long optimalBits;
    private double sizeInMegaBytes;
    private int optimalHashFunctions;
    private double bitsPerItem;
    private double actualFalsePositiveRate;

    public BloomFilterResult() {}

    public BloomFilterResult(long optimalBits, double sizeInMegaBytes, int optimalHashFunctions, double bitsPerItem, double actualFalsePositiveRate) {
        this.optimalBits = optimalBits;
        this.sizeInMegaBytes = sizeInMegaBytes;
        this.optimalHashFunctions = optimalHashFunctions;
        this.bitsPerItem = bitsPerItem;
        this.actualFalsePositiveRate = actualFalsePositiveRate;
    }

    public long getOptimalBits() {
        return optimalBits;
    }

    public void setOptimalBits(long optimalBits) {
        this.optimalBits = optimalBits;
    }

    public double getSizeInMegaBytes() {
        return sizeInMegaBytes;
    }

    public void setSizeInMegaBytes(double sizeInMegaBytes) {
        this.sizeInMegaBytes = sizeInMegaBytes;
    }

    public int getOptimalHashFunctions() {
        return optimalHashFunctions;
    }

    public void setOptimalHashFunctions(int optimalHashFunctions) {
        this.optimalHashFunctions = optimalHashFunctions;
    }

    public double getBitsPerItem() {
        return bitsPerItem;
    }

    public void setBitsPerItem(double bitsPerItem) {
        this.bitsPerItem = bitsPerItem;
    }

    public double getActualFalsePositiveRate() {
        return actualFalsePositiveRate;
    }

    public void setActualFalsePositiveRate(double actualFalsePositiveRate) {
        this.actualFalsePositiveRate = actualFalsePositiveRate;
    }
}
