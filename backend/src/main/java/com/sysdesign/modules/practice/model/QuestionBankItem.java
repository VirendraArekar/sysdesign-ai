package com.sysdesign.modules.practice.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "question_bank")
public class QuestionBankItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(name = "company_tags")
    private String[] companyTags = new String[]{};

    @Column(name = "is_verified_public")
    private boolean verifiedPublic = true;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "model_answer", nullable = false, columnDefinition = "TEXT")
    private String modelAnswer;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_points", columnDefinition = "jsonb")
    private String keyPoints = "[]";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public QuestionBankItem() {}

    public QuestionBankItem(String title, String category, String difficulty, String[] companyTags,
                            boolean verifiedPublic, String questionText, String modelAnswer, String keyPoints) {
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.companyTags = companyTags;
        this.verifiedPublic = verifiedPublic;
        this.questionText = questionText;
        this.modelAnswer = modelAnswer;
        this.keyPoints = keyPoints;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String[] getCompanyTags() {
        return companyTags;
    }

    public void setCompanyTags(String[] companyTags) {
        this.companyTags = companyTags;
    }

    public boolean isVerifiedPublic() {
        return verifiedPublic;
    }

    public void setVerifiedPublic(boolean verifiedPublic) {
        this.verifiedPublic = verifiedPublic;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public String getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(String keyPoints) {
        this.keyPoints = keyPoints;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
