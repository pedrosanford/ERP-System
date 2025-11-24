package com.edusync.finance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "finance_scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student ID is required")
    @Size(max = 50)
    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;

    @Size(max = 100)
    @Column(name = "scholarship_type", length = 100)
    private String scholarshipType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount must be positive")
    @Column(name = "amount", precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Size(max = 50)
    @Column(name = "academic_year", length = 50)
    private String academicYear;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ScholarshipStatus status = ScholarshipStatus.ACTIVE;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Size(max = 20)
    @Column(name = "source_module", length = 20)
    private String sourceModule;

    @Column(name = "source_reference_id")
    private Long sourceReferenceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum ScholarshipStatus {
        ACTIVE, PENDING, CANCELLED, COMPLETED
    }

    // Lifecycle callbacks
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
    public Scholarship() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getScholarshipType() {
        return scholarshipType;
    }

    public void setScholarshipType(String scholarshipType) {
        this.scholarshipType = scholarshipType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public ScholarshipStatus getStatus() {
        return status;
    }

    public void setStatus(ScholarshipStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getSourceModule() {
        return sourceModule;
    }

    public void setSourceModule(String sourceModule) {
        this.sourceModule = sourceModule;
    }

    public Long getSourceReferenceId() {
        return sourceReferenceId;
    }

    public void setSourceReferenceId(Long sourceReferenceId) {
        this.sourceReferenceId = sourceReferenceId;
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
}
