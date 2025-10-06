package com.edusync.student.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Student ID is required")
    @Size(max = 50)
    @Column(name = "student_id", unique = true, nullable = false, length = 50)
    private String studentId;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100)
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255)
    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;
    
    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Size(max = 255)
    @Column(name = "address")
    private String address;
    
    @NotNull(message = "Date of birth is required")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Enrollment date is required")
    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;
    
    @NotBlank(message = "Program is required")
    @Size(max = 100)
    @Column(name = "program", nullable = false, length = 100)
    private String program;
    
    @Column(name = "current_semester")
    private Integer currentSemester;
    
    @Column(name = "gpa", precision = 4, scale = 2)
    private BigDecimal gpa;
    
    @Column(name = "attendance_percentage")
    private Integer attendancePercentage;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StudentStatus status = StudentStatus.ACTIVE;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fee_status", nullable = false, length = 20)
    private FeeStatus feeStatus = FeeStatus.PENDING;
    
    @Column(name = "last_payment_date")
    private LocalDate lastPaymentDate;
    
    @Column(name = "guardian_name", length = 200)
    private String guardianName;
    
    @Column(name = "guardian_phone", length = 20)
    private String guardianPhone;
    
    @Column(name = "guardian_email", length = 255)
    private String guardianEmail;
    
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
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }
    
    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
    
    public String getProgram() {
        return program;
    }
    
    public void setProgram(String program) {
        this.program = program;
    }
    
    public Integer getCurrentSemester() {
        return currentSemester;
    }
    
    public void setCurrentSemester(Integer currentSemester) {
        this.currentSemester = currentSemester;
    }
    
    public BigDecimal getGpa() {
        return gpa;
    }
    
    public void setGpa(BigDecimal gpa) {
        this.gpa = gpa;
    }
    
    public Integer getAttendancePercentage() {
        return attendancePercentage;
    }
    
    public void setAttendancePercentage(Integer attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
    
    public StudentStatus getStatus() {
        return status;
    }
    
    public void setStatus(StudentStatus status) {
        this.status = status;
    }
    
    public FeeStatus getFeeStatus() {
        return feeStatus;
    }
    
    public void setFeeStatus(FeeStatus feeStatus) {
        this.feeStatus = feeStatus;
    }
    
    public LocalDate getLastPaymentDate() {
        return lastPaymentDate;
    }
    
    public void setLastPaymentDate(LocalDate lastPaymentDate) {
        this.lastPaymentDate = lastPaymentDate;
    }
    
    public String getGuardianName() {
        return guardianName;
    }
    
    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }
    
    public String getGuardianPhone() {
        return guardianPhone;
    }
    
    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }
    
    public String getGuardianEmail() {
        return guardianEmail;
    }
    
    public void setGuardianEmail(String guardianEmail) {
        this.guardianEmail = guardianEmail;
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
    
    public enum StudentStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        GRADUATED
    }
    
    public enum FeeStatus {
        PAID,
        PENDING,
        OVERDUE
    }
}

