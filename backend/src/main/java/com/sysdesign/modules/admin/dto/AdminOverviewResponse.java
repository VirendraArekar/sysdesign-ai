package com.sysdesign.modules.admin.dto;

import java.util.List;
import java.util.Map;

public class AdminOverviewResponse {

    private long totalUsers;
    private long activeSubscriptions;
    private long proSubscribers;
    private long enterpriseSubscribers;
    private long freeTierUsers;
    private long totalAiTokensUsed;
    private long jvmMemoryUsedMb;
    private long jvmMemoryMaxMb;
    private List<UserManagementItem> candidates;
    private List<Map<String, Object>> aiFeatureUsage;

    public AdminOverviewResponse() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveSubscriptions() {
        return activeSubscriptions;
    }

    public void setActiveSubscriptions(long activeSubscriptions) {
        this.activeSubscriptions = activeSubscriptions;
    }

    public long getProSubscribers() {
        return proSubscribers;
    }

    public void setProSubscribers(long proSubscribers) {
        this.proSubscribers = proSubscribers;
    }

    public long getEnterpriseSubscribers() {
        return enterpriseSubscribers;
    }

    public void setEnterpriseSubscribers(long enterpriseSubscribers) {
        this.enterpriseSubscribers = enterpriseSubscribers;
    }

    public long getFreeTierUsers() {
        return freeTierUsers;
    }

    public void setFreeTierUsers(long freeTierUsers) {
        this.freeTierUsers = freeTierUsers;
    }

    public long getTotalAiTokensUsed() {
        return totalAiTokensUsed;
    }

    public void setTotalAiTokensUsed(long totalAiTokensUsed) {
        this.totalAiTokensUsed = totalAiTokensUsed;
    }

    public long getJvmMemoryUsedMb() {
        return jvmMemoryUsedMb;
    }

    public void setJvmMemoryUsedMb(long jvmMemoryUsedMb) {
        this.jvmMemoryUsedMb = jvmMemoryUsedMb;
    }

    public long getJvmMemoryMaxMb() {
        return jvmMemoryMaxMb;
    }

    public void setJvmMemoryMaxMb(long jvmMemoryMaxMb) {
        this.jvmMemoryMaxMb = jvmMemoryMaxMb;
    }

    public List<UserManagementItem> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<UserManagementItem> candidates) {
        this.candidates = candidates;
    }

    public List<Map<String, Object>> getAiFeatureUsage() {
        return aiFeatureUsage;
    }

    public void setAiFeatureUsage(List<Map<String, Object>> aiFeatureUsage) {
        this.aiFeatureUsage = aiFeatureUsage;
    }
}
