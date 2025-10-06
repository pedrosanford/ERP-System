package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance", indexes = {
    @Index(name = "idx_attendance_staff_date", columnList = "staff_id, date")
})
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "staff_id", nullable = false)
    private Long staffId; // FK -> staff.id
    
    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Column(name = "check_in_time")
    private LocalTime checkInTime;
    
    @Column(name = "check_out_time")
    private LocalTime checkOutTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private AttendanceStatus status = AttendanceStatus.PRESENT;
    
    @Column(name = "hours_worked", precision = 4, scale = 2)
    private BigDecimal hoursWorked;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Attendance() {}
    
    public Attendance(Long staffId, LocalDate date, AttendanceStatus status) {
        this.staffId = staffId;
        this.date = date;
        this.status = status;
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
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public LocalTime getCheckInTime() {
        return checkInTime;
    }
    
    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }
    
    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }
    
    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
    
    public AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
    
    public BigDecimal getHoursWorked() {
        return hoursWorked;
    }
    
    public void setHoursWorked(BigDecimal hoursWorked) {
        this.hoursWorked = hoursWorked;
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
    
    // Enum
    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, HALF_DAY, LEAVE
    }
}

