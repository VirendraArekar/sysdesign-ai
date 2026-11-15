package com.sysdesign.modules.interview.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_messages")
public class InterviewMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(name = "sender_role", nullable = false, length = 20)
    private String senderRole; // INTERVIEWER, CANDIDATE

    @Column(name = "step_stage", nullable = false, length = 50)
    private String stepStage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public InterviewMessage() {}

    public InterviewMessage(InterviewSession session, String senderRole, String stepStage, String content, Integer sequenceOrder) {
        this.session = session;
        this.senderRole = senderRole;
        this.stepStage = stepStage;
        this.content = content;
        this.sequenceOrder = sequenceOrder;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    public String getStepStage() { return stepStage; }
    public void setStepStage(String stepStage) { this.stepStage = stepStage; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
