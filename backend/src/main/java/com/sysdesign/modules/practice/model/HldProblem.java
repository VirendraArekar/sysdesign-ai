package com.sysdesign.modules.practice.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;

@Entity
@Table(name = "hld_problems")
public class HldProblem {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String category; // Social Media, Streaming, FinTech, E-Commerce, Infrastructure, Storage

    @Column(nullable = false, length = 20)
    private String difficulty; // BEGINNER, SENIOR, STAFF, PRINCIPAL

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "functional_requirements", columnDefinition = "jsonb")
    private String functionalRequirements = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "non_functional_requirements", columnDefinition = "jsonb")
    private String nonFunctionalRequirements = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "capacity_estimation", columnDefinition = "jsonb")
    private String capacityEstimation = "{}";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "api_design", columnDefinition = "jsonb")
    private String apiDesign = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "database_schema", columnDefinition = "jsonb")
    private String databaseSchema = "{}";

    @Column(name = "architecture_diagram_mermaid", nullable = false, columnDefinition = "TEXT")
    private String architectureDiagramMermaid;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "deep_dive_topics", columnDefinition = "jsonb")
    private String deepDiveTopics = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "trade_offs", columnDefinition = "jsonb")
    private String tradeOffs = "[]";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public HldProblem() {}

    public HldProblem(String id, String title, String category, String difficulty, String description, String architectureDiagramMermaid) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.difficulty = difficulty;
        this.description = description;
        this.architectureDiagramMermaid = architectureDiagramMermaid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFunctionalRequirements() {
        return functionalRequirements;
    }

    public void setFunctionalRequirements(String functionalRequirements) {
        this.functionalRequirements = functionalRequirements;
    }

    public String getNonFunctionalRequirements() {
        return nonFunctionalRequirements;
    }

    public void setNonFunctionalRequirements(String nonFunctionalRequirements) {
        this.nonFunctionalRequirements = nonFunctionalRequirements;
    }

    public String getCapacityEstimation() {
        return capacityEstimation;
    }

    public void setCapacityEstimation(String capacityEstimation) {
        this.capacityEstimation = capacityEstimation;
    }

    public String getApiDesign() {
        return apiDesign;
    }

    public void setApiDesign(String apiDesign) {
        this.apiDesign = apiDesign;
    }

    public String getDatabaseSchema() {
        return databaseSchema;
    }

    public void setDatabaseSchema(String databaseSchema) {
        this.databaseSchema = databaseSchema;
    }

    public String getArchitectureDiagramMermaid() {
        return architectureDiagramMermaid;
    }

    public void setArchitectureDiagramMermaid(String architectureDiagramMermaid) {
        this.architectureDiagramMermaid = architectureDiagramMermaid;
    }

    public String getDeepDiveTopics() {
        return deepDiveTopics;
    }

    public void setDeepDiveTopics(String deepDiveTopics) {
        this.deepDiveTopics = deepDiveTopics;
    }

    public String getTradeOffs() {
        return tradeOffs;
    }

    public void setTradeOffs(String tradeOffs) {
        this.tradeOffs = tradeOffs;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
