package com.sysdesign.modules.simulators.dto;

public class AvailabilityRequest {

    private double slaPercentage = 99.99; // Four nines

    public AvailabilityRequest() {}

    public AvailabilityRequest(double slaPercentage) {
        this.slaPercentage = slaPercentage;
    }

    public double getSlaPercentage() {
        return slaPercentage;
    }

    public void setSlaPercentage(double slaPercentage) {
        this.slaPercentage = slaPercentage;
    }
}
