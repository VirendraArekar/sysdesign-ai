package com.sysdesign.modules.admin.dto;

import java.time.Instant;
import java.util.UUID;

public class UserManagementItem {

    private UUID userId;
    private String email;
    private String fullName;
    private String planTier;
    private boolean active;
    private int dailyTokenQuota;
    private Instant createdAt;

    public UserManagementItem() {}

    public UserManagementItem(UUID userId, String email, String fullName, String planTier, boolean active, int dailyTokenQuota, Instant createdAt) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.planTier = planTier;
        this.active = active;
        this.dailyTokenQuota = dailyTokenQuota;
        this.createdAt = createdAt;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        this.planTier = planTier;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getDailyTokenQuota() {
        return dailyTokenQuota;
    }

    public void setDailyTokenQuota(int dailyTokenQuota) {
        this.dailyTokenQuota = dailyTokenQuota;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
