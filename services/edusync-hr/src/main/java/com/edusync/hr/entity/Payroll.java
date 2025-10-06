package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "staff_id", nullable = false)
    private Long staffId; // FK -> staff.id
    
    @NotNull
    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;
    
    @NotNull
    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;
    
    @NotNull
    @Column(name = "base_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseSalary;
    
    @Column(name = "bonuses", precision = 10, scale = 2)
    private BigDecimal bonuses = BigDecimal.ZERO;
    
    @Column(name = "deductions", precision = 10, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;
    
    @Column(name = "tax", precision = 10, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;
    
    @NotNull
    @Column(name = "net_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal netSalary;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 50)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private PayrollStatus status = PayrollStatus.PENDING;
    
    @Column(name = "created_by")
    private Long createdBy; // FK -> users.id
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Payroll() {}
    
    public Payroll(Long staffId, LocalDate payPeriodStart, LocalDate payPeriodEnd, BigDecimal baseSalary, BigDecimal netSalary) {
        this.staffId = staffId;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
        this.baseSalary = baseSalary;
        this.netSalary = netSalary;
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
    
    public LocalDate getPayPeriodStart() {
        return payPeriodStart;
    }
    
    public void setPayPeriodStart(LocalDate payPeriodStart) {
        this.payPeriodStart = payPeriodStart;
    }
    
    public LocalDate getPayPeriodEnd() {
        return payPeriodEnd;
    }
    
    public void setPayPeriodEnd(LocalDate payPeriodEnd) {
        this.payPeriodEnd = payPeriodEnd;
    }
    
    public BigDecimal getBaseSalary() {
        return baseSalary;
    }
    
    public void setBaseSalary(BigDecimal baseSalary) {
        this.baseSalary = baseSalary;
    }
    
    public BigDecimal getBonuses() {
        return bonuses;
    }
    
    public void setBonuses(BigDecimal bonuses) {
        this.bonuses = bonuses;
    }
    
    public BigDecimal getDeductions() {
        return deductions;
    }
    
    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }
    
    public BigDecimal getTax() {
        return tax;
    }
    
    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }
    
    public BigDecimal getNetSalary() {
        return netSalary;
    }
    
    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }
    
    public LocalDate getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PayrollStatus getStatus() {
        return status;
    }
    
    public void setStatus(PayrollStatus status) {
        this.status = status;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Enums
    public enum PaymentMethod {
        BANK_TRANSFER, CHECK, CASH, DIRECT_DEPOSIT
    }
    
    public enum PayrollStatus {
        PENDING, PROCESSED, PAID, CANCELLED
    }
}

