package com.sysdesign.modules.interview.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    private String category; // HLD, LLD, DISTRIBUTED_SYSTEMS

    @Column(name = "target_level", nullable = false, length = 50)
    private String targetLevel; // BEGINNER, SENIOR, STAFF, PRINCIPAL

    @Column(name = "interviewer_persona", nullable = false, length = 50)
    private String interviewerPersona = "STAFF_ENGINEER";

    @Column(name = "problem_title", nullable = false, length = 255)
    private String problemTitle;

    @Column(nullable = false, length = 30)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, PAUSED, COMPLETED

    @Column(name = "current_stage", length = 50)
    private String currentStage = "REQUIREMENTS"; // REQUIREMENTS, ESTIMATION, API_DESIGN, DB_DESIGN, HIGH_LEVEL_ARCH, FAILURE_SCENARIOS, TRADE_OFFS

    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("sequenceOrder ASC")
    private List<InterviewMessage> messages = new ArrayList<>();

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private InterviewEvaluation evaluation;

    public InterviewSession() {}

    public InterviewSession(UUID userId, String category, String targetLevel, String interviewerPersona, String problemTitle) {
        this.userId = userId;
        this.category = category;
        this.targetLevel = targetLevel;
        this.interviewerPersona = interviewerPersona;
        this.problemTitle = problemTitle;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }
    public String getInterviewerPersona() { return interviewerPersona; }
    public void setInterviewerPersona(String interviewerPersona) { this.interviewerPersona = interviewerPersona; }
    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public List<InterviewMessage> getMessages() { return messages; }
    public void setMessages(List<InterviewMessage> messages) { this.messages = messages; }
    public InterviewEvaluation getEvaluation() { return evaluation; }
    public void setEvaluation(InterviewEvaluation evaluation) {
        this.evaluation = evaluation;
        if (evaluation != null) evaluation.setSession(this);
    }
}
