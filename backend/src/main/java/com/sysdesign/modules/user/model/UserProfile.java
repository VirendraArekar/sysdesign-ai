package com.sysdesign.modules.user.model;

import com.sysdesign.common.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "target_role", length = 100)
    private String targetRole = "Senior Software Engineer";

    @Column(name = "experience_years")
    private Integer experienceYears = 3;

    @Column(name = "target_companies")
    private String[] targetCompanies = new String[]{"Google", "Amazon", "Meta", "Netflix", "Uber"};

    @Column(name = "preferred_level", length = 50)
    private String preferredLevel = "INTERMEDIATE";

    @Column(name = "interview_readiness_score", precision = 5, scale = 2)
    private BigDecimal interviewReadinessScore = BigDecimal.ZERO;

    @Column(name = "daily_streak")
    private Integer dailyStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    public UserProfile() {}

    public UserProfile(User user) {
        this.user = user;
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

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String[] getTargetCompanies() {
        return targetCompanies;
    }

    public void setTargetCompanies(String[] targetCompanies) {
        this.targetCompanies = targetCompanies;
    }

    public String getPreferredLevel() {
        return preferredLevel;
    }

    public void setPreferredLevel(String preferredLevel) {
        this.preferredLevel = preferredLevel;
    }

    public BigDecimal getInterviewReadinessScore() {
        return interviewReadinessScore;
    }

    public void setInterviewReadinessScore(BigDecimal interviewReadinessScore) {
        this.interviewReadinessScore = interviewReadinessScore;
    }

    public Integer getDailyStreak() {
        return dailyStreak;
    }

    public void setDailyStreak(Integer dailyStreak) {
        this.dailyStreak = dailyStreak;
    }

    public LocalDate getLastActiveDate() {
        return lastActiveDate;
    }

    public void setLastActiveDate(LocalDate lastActiveDate) {
        this.lastActiveDate = lastActiveDate;
    }
}
