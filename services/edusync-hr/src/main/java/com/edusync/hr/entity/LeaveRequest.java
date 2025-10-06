package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "staff_id", nullable = false)
    private Long staffId; // FK -> staff.id
    
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", length = 50)
    private LeaveType leaveType;
    
    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "days_count")
    private Integer daysCount;
    
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private LeaveStatus status = LeaveStatus.PENDING;
    
    @Column(name = "approved_by")
    private Long approvedBy; // FK -> users.id
    
    @Column(name = "approval_date")
    private LocalDate approvalDate;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
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
    public LeaveRequest() {}
    
    public LeaveRequest(Long staffId, LeaveType leaveType, LocalDate startDate, LocalDate endDate, String reason) {
        this.staffId = staffId;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
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
    
    public LeaveType getLeaveType() {
        return leaveType;
    }
    
    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Integer getDaysCount() {
        return daysCount;
    }
    
    public void setDaysCount(Integer daysCount) {
        this.daysCount = daysCount;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public LeaveStatus getStatus() {
        return status;
    }
    
    public void setStatus(LeaveStatus status) {
        this.status = status;
    }
    
    public Long getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public LocalDate getApprovalDate() {
        return approvalDate;
    }
    
    public void setApprovalDate(LocalDate approvalDate) {
        this.approvalDate = approvalDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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
    
    // Enums
    public enum LeaveType {
        SICK, VACATION, PERSONAL, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, OTHER
    }
    
    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}

