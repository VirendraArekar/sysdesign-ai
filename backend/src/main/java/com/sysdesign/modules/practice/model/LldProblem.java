package com.sysdesign.modules.practice.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;

@Entity
@Table(name = "lld_problems")
public class LldProblem {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 20)
    private String difficulty; // BEGINNER, INTERMEDIATE, SENIOR, STAFF

    @Column(name = "problem_statement", nullable = false, columnDefinition = "TEXT")
    private String problemStatement;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "solid_principles_applied", columnDefinition = "jsonb")
    private String solidPrinciplesApplied = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "design_patterns_used", columnDefinition = "jsonb")
    private String designPatternsUsed = "[]";

    @Column(name = "class_diagram_mermaid", nullable = false, columnDefinition = "TEXT")
    private String classDiagramMermaid;

    @Column(name = "java_solution_code", nullable = false, columnDefinition = "TEXT")
    private String javaSolutionCode;

    @Column(name = "unit_tests_code", nullable = false, columnDefinition = "TEXT")
    private String unitTestsCode;

    @Column(name = "extensibility_notes", nullable = false, columnDefinition = "TEXT")
    private String extensibilityNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public LldProblem() {}

    public LldProblem(String id, String title, String difficulty, String problemStatement,
                      String classDiagramMermaid, String javaSolutionCode, String unitTestsCode, String extensibilityNotes) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.problemStatement = problemStatement;
        this.classDiagramMermaid = classDiagramMermaid;
        this.javaSolutionCode = javaSolutionCode;
        this.unitTestsCode = unitTestsCode;
        this.extensibilityNotes = extensibilityNotes;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getProblemStatement() {
        return problemStatement;
    }

    public void setProblemStatement(String problemStatement) {
        this.problemStatement = problemStatement;
    }

    public String getSolidPrinciplesApplied() {
        return solidPrinciplesApplied;
    }

    public void setSolidPrinciplesApplied(String solidPrinciplesApplied) {
        this.solidPrinciplesApplied = solidPrinciplesApplied;
    }

    public String getDesignPatternsUsed() {
        return designPatternsUsed;
    }

    public void setDesignPatternsUsed(String designPatternsUsed) {
        this.designPatternsUsed = designPatternsUsed;
    }

    public String getClassDiagramMermaid() {
        return classDiagramMermaid;
    }

    public void setClassDiagramMermaid(String classDiagramMermaid) {
        this.classDiagramMermaid = classDiagramMermaid;
    }

    public String getJavaSolutionCode() {
        return javaSolutionCode;
    }

    public void setJavaSolutionCode(String javaSolutionCode) {
        this.javaSolutionCode = javaSolutionCode;
    }

    public String getUnitTestsCode() {
        return unitTestsCode;
    }

    public void setUnitTestsCode(String unitTestsCode) {
        this.unitTestsCode = unitTestsCode;
    }

    public String getExtensibilityNotes() {
        return extensibilityNotes;
    }

    public void setExtensibilityNotes(String extensibilityNotes) {
        this.extensibilityNotes = extensibilityNotes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
