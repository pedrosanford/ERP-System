package com.edusync.finance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "finance_tuition_fees")
public class TuitionFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student ID is required")
    @Size(max = 50)
    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;

    @Size(max = 50)
    @Column(name = "academic_year", length = 50)
    private String academicYear;

    @Size(max = 100)
    @Column(name = "program", length = 100)
    private String program;

    @NotNull(message = "Base tuition is required")
    @DecimalMin(value = "0.0", message = "Base tuition must be positive")
    @Column(name = "base_tuition", precision = 15, scale = 2)
    private BigDecimal baseTuition;

    @Column(name = "additional_fees", precision = 15, scale = 2)
    private BigDecimal additionalFees = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "net_amount", precision = 15, scale = 2)
    private BigDecimal netAmount;

    @Size(max = 50)
    @Column(name = "payment_plan", length = 50)
    private String paymentPlan;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TuitionFeeStatus status = TuitionFeeStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum TuitionFeeStatus {
        DRAFT, ACTIVE, COMPLETED, CANCELLED
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateAmounts();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateAmounts();
    }

    // Helper method to calculate total and net amounts
    private void calculateAmounts() {
        if (baseTuition != null) {
            totalAmount = baseTuition.add(additionalFees != null ? additionalFees : BigDecimal.ZERO);
            netAmount = totalAmount.subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);
        }
    }

    // Constructors
    public TuitionFee() {}

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

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public BigDecimal getBaseTuition() {
        return baseTuition;
    }

    public void setBaseTuition(BigDecimal baseTuition) {
        this.baseTuition = baseTuition;
    }

    public BigDecimal getAdditionalFees() {
        return additionalFees;
    }

    public void setAdditionalFees(BigDecimal additionalFees) {
        this.additionalFees = additionalFees;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public String getPaymentPlan() {
        return paymentPlan;
    }

    public void setPaymentPlan(String paymentPlan) {
        this.paymentPlan = paymentPlan;
    }

    public TuitionFeeStatus getStatus() {
        return status;
    }

    public void setStatus(TuitionFeeStatus status) {
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
}
