package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_evaluations")
public class StaffEvaluation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "staff_id", nullable = false)
    private Long staffId; // FK -> staff.id
    
    @NotNull
    @Column(name = "evaluation_date", nullable = false)
    private LocalDate evaluationDate;
    
    @Column(name = "evaluator_id")
    private Long evaluatorId; // FK -> staff.id
    
    @Column(name = "period_start")
    private LocalDate periodStart;
    
    @Column(name = "period_end")
    private LocalDate periodEnd;
    
    @Column(name = "performance_score", precision = 3, scale = 2)
    private BigDecimal performanceScore; // Например: 4.5 из 5
    
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;
    
    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;
    
    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;
    
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EvaluationStatus status = EvaluationStatus.DRAFT;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public StaffEvaluation() {}
    
    public StaffEvaluation(Long staffId, LocalDate evaluationDate, Long evaluatorId) {
        this.staffId = staffId;
        this.evaluationDate = evaluationDate;
        this.evaluatorId = evaluatorId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getStaffId() {
        return staffId;
    }
    
    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }
    
    public LocalDate getEvaluationDate() {
        return evaluationDate;
    }
    
    public void setEvaluationDate(LocalDate evaluationDate) {
        this.evaluationDate = evaluationDate;
    }
    
    public Long getEvaluatorId() {
        return evaluatorId;
    }
    
    public void setEvaluatorId(Long evaluatorId) {
        this.evaluatorId = evaluatorId;
    }
    
    public LocalDate getPeriodStart() {
        return periodStart;
    }
    
    public void setPeriodStart(LocalDate periodStart) {
        this.periodStart = periodStart;
    }
    
    public LocalDate getPeriodEnd() {
        return periodEnd;
    }
    
    public void setPeriodEnd(LocalDate periodEnd) {
        this.periodEnd = periodEnd;
    }
    
    public BigDecimal getPerformanceScore() {
        return performanceScore;
    }
    
    public void setPerformanceScore(BigDecimal performanceScore) {
        this.performanceScore = performanceScore;
    }
    
    public String getStrengths() {
        return strengths;
    }
    
    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }
    
    public String getAreasForImprovement() {
        return areasForImprovement;
    }
    
    public void setAreasForImprovement(String areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }
    
    public String getGoals() {
        return goals;
    }
    
    public void setGoals(String goals) {
        this.goals = goals;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public EvaluationStatus getStatus() {
        return status;
    }
    
    public void setStatus(EvaluationStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Enum
    public enum EvaluationStatus {
        DRAFT, COMPLETED, REVIEWED, ACKNOWLEDGED
    }
}

