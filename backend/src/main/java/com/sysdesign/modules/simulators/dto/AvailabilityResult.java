package com.sysdesign.modules.simulators.dto;

public class AvailabilityResult {

    private double slaPercentage;
    private double yearlyDowntimeMinutes;
    private double monthlyDowntimeMinutes;
    private double dailyDowntimeSeconds;
    private String classification; // High Availability, Fault Tolerant, Mission Critical

    public AvailabilityResult() {}

    public AvailabilityResult(double slaPercentage, double yearlyDowntimeMinutes, double monthlyDowntimeMinutes, double dailyDowntimeSeconds, String classification) {
        this.slaPercentage = slaPercentage;
        this.yearlyDowntimeMinutes = yearlyDowntimeMinutes;
        this.monthlyDowntimeMinutes = monthlyDowntimeMinutes;
        this.dailyDowntimeSeconds = dailyDowntimeSeconds;
        this.classification = classification;
    }

    public double getSlaPercentage() {
        return slaPercentage;
    }

    public void setSlaPercentage(double slaPercentage) {
        this.slaPercentage = slaPercentage;
    }

    public double getYearlyDowntimeMinutes() {
        return yearlyDowntimeMinutes;
    }

    public void setYearlyDowntimeMinutes(double yearlyDowntimeMinutes) {
        this.yearlyDowntimeMinutes = yearlyDowntimeMinutes;
    }

    public double getMonthlyDowntimeMinutes() {
        return monthlyDowntimeMinutes;
    }

    public void setMonthlyDowntimeMinutes(double monthlyDowntimeMinutes) {
        this.monthlyDowntimeMinutes = monthlyDowntimeMinutes;
    }

    public double getDailyDowntimeSeconds() {
        return dailyDowntimeSeconds;
    }

    public void setDailyDowntimeSeconds(double dailyDowntimeSeconds) {
        this.dailyDowntimeSeconds = dailyDowntimeSeconds;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }
}
