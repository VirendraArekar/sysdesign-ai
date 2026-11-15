package com.sysdesign.modules.interview.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_evaluations")
public class InterviewEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private InterviewSession session;

    @Column(name = "overall_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "category_scores", nullable = false, columnDefinition = "jsonb")
    private String categoryScores;

    @Column(name = "strengths", columnDefinition = "jsonb")
    private String strengths = "[]";

    @Column(name = "weaknesses", columnDefinition = "jsonb")
    private String weaknesses = "[]";

    @Column(name = "missing_concepts", columnDefinition = "jsonb")
    private String missingConcepts = "[]";

    @Column(name = "incorrect_assumptions", columnDefinition = "jsonb")
    private String incorrectAssumptions = "[]";

    @Column(name = "suggested_improvements", columnDefinition = "jsonb")
    private String suggestedImprovements = "[]";

    @Column(name = "ideal_answer_outline", columnDefinition = "TEXT")
    private String idealAnswerOutline;

    @Column(name = "recommended_topics", columnDefinition = "jsonb")
    private String recommendedTopics = "[]";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public InterviewEvaluation() {}

    public InterviewEvaluation(InterviewSession session, BigDecimal overallScore, String categoryScores, String idealAnswerOutline) {
        this.session = session;
        this.overallScore = overallScore;
        this.categoryScores = categoryScores;
        this.idealAnswerOutline = idealAnswerOutline;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public String getCategoryScores() { return categoryScores; }
    public void setCategoryScores(String categoryScores) { this.categoryScores = categoryScores; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }
    public String getMissingConcepts() { return missingConcepts; }
    public void setMissingConcepts(String missingConcepts) { this.missingConcepts = missingConcepts; }
    public String getIncorrectAssumptions() { return incorrectAssumptions; }
    public void setIncorrectAssumptions(String incorrectAssumptions) { this.incorrectAssumptions = incorrectAssumptions; }
    public String getSuggestedImprovements() { return suggestedImprovements; }
    public void setSuggestedImprovements(String suggestedImprovements) { this.suggestedImprovements = suggestedImprovements; }
    public String getIdealAnswerOutline() { return idealAnswerOutline; }
    public void setIdealAnswerOutline(String idealAnswerOutline) { this.idealAnswerOutline = idealAnswerOutline; }
    public String getRecommendedTopics() { return recommendedTopics; }
    public void setRecommendedTopics(String recommendedTopics) { this.recommendedTopics = recommendedTopics; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
