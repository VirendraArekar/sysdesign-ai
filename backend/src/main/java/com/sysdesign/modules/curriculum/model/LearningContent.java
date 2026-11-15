package com.sysdesign.modules.curriculum.model;

import com.sysdesign.common.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "learning_content")
public class LearningContent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    private Topic topic;

    @Column(name = "beginner_explanation", nullable = false, columnDefinition = "TEXT")
    private String beginnerExplanation;

    @Column(name = "deep_technical_explanation", nullable = false, columnDefinition = "TEXT")
    private String deepTechnicalExplanation;

    @Column(name = "architecture_diagram_mermaid", columnDefinition = "TEXT")
    private String architectureDiagramMermaid;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "advantages", columnDefinition = "jsonb")
    private String advantages = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "disadvantages", columnDefinition = "jsonb")
    private String disadvantages = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "real_world_use_cases", columnDefinition = "jsonb")
    private String realWorldUseCases = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "interview_questions", columnDefinition = "jsonb")
    private String interviewQuestions = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "practical_exercises", columnDefinition = "jsonb")
    private String practicalExercises = "[]";

    public LearningContent() {}

    public LearningContent(Topic topic, String beginnerExplanation, String deepTechnicalExplanation, String architectureDiagramMermaid) {
        this.topic = topic;
        this.beginnerExplanation = beginnerExplanation;
        this.deepTechnicalExplanation = deepTechnicalExplanation;
        this.architectureDiagramMermaid = architectureDiagramMermaid;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public String getBeginnerExplanation() {
        return beginnerExplanation;
    }

    public void setBeginnerExplanation(String beginnerExplanation) {
        this.beginnerExplanation = beginnerExplanation;
    }

    public String getDeepTechnicalExplanation() {
        return deepTechnicalExplanation;
    }

    public void setDeepTechnicalExplanation(String deepTechnicalExplanation) {
        this.deepTechnicalExplanation = deepTechnicalExplanation;
    }

    public String getArchitectureDiagramMermaid() {
        return architectureDiagramMermaid;
    }

    public void setArchitectureDiagramMermaid(String architectureDiagramMermaid) {
        this.architectureDiagramMermaid = architectureDiagramMermaid;
    }

    public String getAdvantages() {
        return advantages;
    }

    public void setAdvantages(String advantages) {
        this.advantages = advantages;
    }

    public String getDisadvantages() {
        return disadvantages;
    }

    public void setDisadvantages(String disadvantages) {
        this.disadvantages = disadvantages;
    }

    public String getRealWorldUseCases() {
        return realWorldUseCases;
    }

    public void setRealWorldUseCases(String realWorldUseCases) {
        this.realWorldUseCases = realWorldUseCases;
    }

    public String getInterviewQuestions() {
        return interviewQuestions;
    }

    public void setInterviewQuestions(String interviewQuestions) {
        this.interviewQuestions = interviewQuestions;
    }

    public String getPracticalExercises() {
        return practicalExercises;
    }

    public void setPracticalExercises(String practicalExercises) {
        this.practicalExercises = practicalExercises;
    }
}
