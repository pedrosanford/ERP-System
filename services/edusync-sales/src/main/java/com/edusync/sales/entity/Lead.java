package com.edusync.sales.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 200)
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Size(max = 200)
    @Column(name = "parent_name", length = 200)
    private String parentName;

    @Size(max = 50)
    @Column(name = "grade", length = 50)
    private String grade;

    @Size(max = 100)
    @Column(name = "program", length = 100)
    private String program;

    @Size(max = 100)
    @Column(name = "source", length = 100)
    private String source;

    @Size(max = 50)
    @Column(name = "enrollment_term", length = 50)
    private String enrollmentTerm;

    @NotBlank(message = "Status is required")
    @Size(max = 50)
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20)
    private Priority priority = Priority.MEDIUM;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Email(message = "Email should be valid")
    @Size(max = 255)
    @Column(name = "email", unique = true, length = 255)
    private String email;

    @Column(name = "estimated_tuition_value", precision = 15, scale = 2)
    private BigDecimal estimatedTuitionValue;

    @Size(max = 100)
    @Column(name = "assigned_recruiter", length = 100)
    private String assignedRecruiter;

    @Size(max = 20)
    @Column(name = "preferred_contact_method", length = 20)
    private String preferredContactMethod;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "next_follow_up_date")
    private LocalDate nextFollowUpDate;

    @Column(name = "status_notes", columnDefinition = "TEXT")
    private String statusNotes;

    @Column(name = "application_fee_status")
    private Boolean applicationFeeStatus = false;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "interview_date")
    private LocalDate interviewDate;

    @Size(max = 100)
    @Column(name = "interviewer", length = 100)
    private String interviewer;

    @Column(name = "enrollment_deadline")
    private LocalDate enrollmentDeadline;

    @Column(name = "offer_letter_sent")
    private Boolean offerLetterSent = false;

    @Column(name = "tuition_paid", precision = 15, scale = 2)
    private BigDecimal tuitionPaid = BigDecimal.ZERO;

    @Size(max = 50)
    @Column(name = "student_id", length = 50)
    private String studentId;

    @Size(max = 100)
    @Column(name = "dorm_assigned", length = 100)
    private String dormAssigned;

    @Column(name = "scholarship_requested")
    private Boolean scholarshipRequested = false;

    @Column(name = "scholarship_amount", precision = 15, scale = 2)
    private BigDecimal scholarshipAmount = BigDecimal.ZERO;

    @Column(name = "scholarship_notes", columnDefinition = "TEXT")
    private String scholarshipNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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

    // Enums
    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    // Constructors
    public Lead() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getEnrollmentTerm() {
        return enrollmentTerm;
    }

    public void setEnrollmentTerm(String enrollmentTerm) {
        this.enrollmentTerm = enrollmentTerm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getEstimatedTuitionValue() {
        return estimatedTuitionValue;
    }

    public void setEstimatedTuitionValue(BigDecimal estimatedTuitionValue) {
        this.estimatedTuitionValue = estimatedTuitionValue;
    }

    public String getAssignedRecruiter() {
        return assignedRecruiter;
    }

    public void setAssignedRecruiter(String assignedRecruiter) {
        this.assignedRecruiter = assignedRecruiter;
    }

    public String getPreferredContactMethod() {
        return preferredContactMethod;
    }

    public void setPreferredContactMethod(String preferredContactMethod) {
        this.preferredContactMethod = preferredContactMethod;
    }

    public LocalDate getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(LocalDate followUpDate) {
        this.followUpDate = followUpDate;
    }

    public LocalDate getNextFollowUpDate() {
        return nextFollowUpDate;
    }

    public void setNextFollowUpDate(LocalDate nextFollowUpDate) {
        this.nextFollowUpDate = nextFollowUpDate;
    }

    public String getStatusNotes() {
        return statusNotes;
    }

    public void setStatusNotes(String statusNotes) {
        this.statusNotes = statusNotes;
    }

    public Boolean getApplicationFeeStatus() {
        return applicationFeeStatus;
    }

    public void setApplicationFeeStatus(Boolean applicationFeeStatus) {
        this.applicationFeeStatus = applicationFeeStatus;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewer() {
        return interviewer;
    }

    public void setInterviewer(String interviewer) {
        this.interviewer = interviewer;
    }

    public LocalDate getEnrollmentDeadline() {
        return enrollmentDeadline;
    }

    public void setEnrollmentDeadline(LocalDate enrollmentDeadline) {
        this.enrollmentDeadline = enrollmentDeadline;
    }

    public Boolean getOfferLetterSent() {
        return offerLetterSent;
    }

    public void setOfferLetterSent(Boolean offerLetterSent) {
        this.offerLetterSent = offerLetterSent;
    }

    public BigDecimal getTuitionPaid() {
        return tuitionPaid;
    }

    public void setTuitionPaid(BigDecimal tuitionPaid) {
        this.tuitionPaid = tuitionPaid;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDormAssigned() {
        return dormAssigned;
    }

    public void setDormAssigned(String dormAssigned) {
        this.dormAssigned = dormAssigned;
    }

    public Boolean getScholarshipRequested() {
        return scholarshipRequested;
    }

    public void setScholarshipRequested(Boolean scholarshipRequested) {
        this.scholarshipRequested = scholarshipRequested;
    }

    public BigDecimal getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(BigDecimal scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }

    public String getScholarshipNotes() {
        return scholarshipNotes;
    }

    public void setScholarshipNotes(String scholarshipNotes) {
        this.scholarshipNotes = scholarshipNotes;
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
