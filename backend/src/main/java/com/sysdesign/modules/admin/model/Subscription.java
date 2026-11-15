package com.sysdesign.modules.admin.model;

import com.sysdesign.modules.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "plan_tier", nullable = false, length = 50)
    private String planTier = "FREE"; // FREE, PRO, ENTERPRISE

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, CANCELLED, EXPIRED

    @Column(name = "valid_until")
    private Instant validUntil;

    @Column(name = "daily_ai_token_quota", nullable = false)
    private Integer dailyAiTokenQuota = 50000;

    @Column(name = "daily_interview_quota", nullable = false)
    private Integer dailyInterviewQuota = 3;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Subscription() {}

    public Subscription(User user, String planTier) {
        this.user = user;
        this.planTier = planTier;
        configureQuotas(planTier);
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public void configureQuotas(String tier) {
        this.planTier = tier;
        if ("ENTERPRISE".equalsIgnoreCase(tier)) {
            this.dailyAiTokenQuota = 2_000_000;
            this.dailyInterviewQuota = 50;
        } else if ("PRO".equalsIgnoreCase(tier)) {
            this.dailyAiTokenQuota = 500_000;
            this.dailyInterviewQuota = 20;
        } else {
            this.dailyAiTokenQuota = 50_000;
            this.dailyInterviewQuota = 3;
        }
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        configureQuotas(planTier);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(Instant validUntil) {
        this.validUntil = validUntil;
    }

    public Integer getDailyAiTokenQuota() {
        return dailyAiTokenQuota;
    }

    public void setDailyAiTokenQuota(Integer dailyAiTokenQuota) {
        this.dailyAiTokenQuota = dailyAiTokenQuota;
    }

    public Integer getDailyInterviewQuota() {
        return dailyInterviewQuota;
    }

    public void setDailyInterviewQuota(Integer dailyInterviewQuota) {
        this.dailyInterviewQuota = dailyInterviewQuota;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
