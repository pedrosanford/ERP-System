package com.edusync.hr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_documents")
public class StaffDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "staff_id", nullable = false)
    private Long staffId; // FK -> staff.id
    
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", length = 100)
    private DocumentType documentType;
    
    @NotBlank
    @Size(max = 255)
    @Column(name = "document_name", nullable = false)
    private String documentName;
    
    @NotBlank
    @Size(max = 500)
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize; // Размер в байтах
    
    @NotNull
    @Column(name = "upload_date", nullable = false)
    private LocalDate uploadDate;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate; // Для документов с истечением срока
    
    @Column(name = "uploaded_by")
    private Long uploadedBy; // FK -> users.id
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public StaffDocument() {}
    
    public StaffDocument(Long staffId, DocumentType documentType, String documentName, String filePath, LocalDate uploadDate) {
        this.staffId = staffId;
        this.documentType = documentType;
        this.documentName = documentName;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
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
    
    public DocumentType getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }
    
    public String getDocumentName() {
        return documentName;
    }
    
    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public LocalDate getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public Long getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
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
    public enum DocumentType {
        CONTRACT,
        RESUME,
        ID_COPY,
        PASSPORT,
        CERTIFICATE,
        DIPLOMA,
        LICENSE,
        BACKGROUND_CHECK,
        TAX_FORM,
        BANK_DETAILS,
        OTHER
    }
}

