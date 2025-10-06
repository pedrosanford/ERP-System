package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
public class Staff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", unique = true)
    private Long userId; // FK -> users.id (nullable, если есть аккаунт)
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @NotBlank
    @Email
    @Size(max = 100)
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Size(max = 20)
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private Gender gender;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 50)
    private EmploymentType employmentType;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "position", nullable = false)
    private String position;
    
    @Column(name = "department_id")
    private Long departmentId; // FK -> departments.id
    
    @Column(name = "salary", precision = 10, scale = 2)
    private BigDecimal salary;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private StaffStatus status = StaffStatus.ACTIVE;
    
    @Column(name = "termination_date")
    private LocalDate terminationDate;
    
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
    public Staff() {}
    
    public Staff(String employeeId, String firstName, String lastName, String email, LocalDate hireDate, String position) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hireDate = hireDate;
        this.position = position;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
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
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public Gender getGender() {
        return gender;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDate getHireDate() {
        return hireDate;
    }
    
    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    
    public EmploymentType getEmploymentType() {
        return employmentType;
    }
    
    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }
    
    public String getPosition() {
        return position;
    }
    
    public void setPosition(String position) {
        this.position = position;
    }
    
    public Long getDepartmentId() {
        return departmentId;
    }
    
    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
    
    public BigDecimal getSalary() {
        return salary;
    }
    
    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
    
    public StaffStatus getStatus() {
        return status;
    }
    
    public void setStatus(StaffStatus status) {
        this.status = status;
    }
    
    public LocalDate getTerminationDate() {
        return terminationDate;
    }
    
    public void setTerminationDate(LocalDate terminationDate) {
        this.terminationDate = terminationDate;
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
    
    // Helper method
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN
    }
    
    public enum StaffStatus {
        ACTIVE, ON_LEAVE, TERMINATED, SUSPENDED
    }
}

