package com.edusync.hr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "staff_documents")
public class StaffDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status = DocumentStatus.ACTIVE;

    @Column(length = 10)
    private String fileType;

    private Long fileSize;

    @Column(nullable = false, length = 100)
    private String creator;

    @Column(nullable = false)
    private LocalDateTime dateCreated;

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @Column(length = 100)
    private String contentType;

    @ElementCollection
    @CollectionTable(name = "staff_document_tags", joinColumns = @JoinColumn(name = "document_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    // Additional fields for file-based storage compatibility
    @Column(length = 500)
    private String filePath;

    @Column(length = 100)
    private String documentType; // For backward compatibility

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    // Many-to-One relationship with Staff
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    // Enums
    public enum DocumentType {
        CONTRACT, RESUME, ID_COPY, CERTIFICATE, PERFORMANCE_REVIEW,
        MEDICAL_CERTIFICATE, TRAINING_CERTIFICATE, REFERENCE_LETTER,
        BANK_DETAILS, EMERGENCY_CONTACT, IDENTIFICATION, CERTIFICATION,
        TRAINING, MEDICAL, OTHER
    }

    public enum DocumentCategory {
        PERSONAL, PROFESSIONAL, LEGAL, MEDICAL, ADMINISTRATIVE
    }

    public enum DocumentStatus {
        ACTIVE, ARCHIVED, EXPIRED, DELETED
    }

    // Constructors
    public StaffDocument() {
        this.dateCreated = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = DocumentStatus.ACTIVE;
    }

    public StaffDocument(String title, String fileName, DocumentType type, 
                        DocumentCategory category, String description, String creator) {
        this();
        this.title = title;
        this.fileName = fileName;
        this.type = type;
        this.category = category;
        this.description = description;
        this.creator = creator;
    }

    // Business Methods
    public void updateMetadata(String title, String description, String updatedBy) {
        if (title != null && !title.trim().isEmpty()) {
            this.title = title.trim();
        }
        if (description != null) {
            this.description = description.trim();
        }
        this.lastModified = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // Could track who updated it if needed
    }

    public void archive() {
        this.status = DocumentStatus.ARCHIVED;
        this.lastModified = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void reactivate() {
        this.status = DocumentStatus.ACTIVE;
        this.lastModified = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsExpired() {
        this.status = DocumentStatus.EXPIRED;
        this.lastModified = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.status = DocumentStatus.DELETED;
        this.lastModified = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == DocumentStatus.ACTIVE;
    }

    public boolean isArchived() {
        return this.status == DocumentStatus.ARCHIVED;
    }

    public boolean isExpired() {
        return this.status == DocumentStatus.EXPIRED;
    }

    public boolean isDeleted() {
        return this.status == DocumentStatus.DELETED;
    }

    public boolean hasFileData() {
        return this.fileData != null && this.fileData.length > 0;
    }

    public boolean hasFilePath() {
        return this.filePath != null && !this.filePath.trim().isEmpty();
    }

    // Tag management methods
    public void addTag(String tag) {
        if (tag != null && !tag.trim().isEmpty()) {
            String trimmedTag = tag.trim().toLowerCase();
            if (!this.tags.contains(trimmedTag)) {
                this.tags.add(trimmedTag);
                this.lastModified = LocalDateTime.now();
                this.updatedAt = LocalDateTime.now();
            }
        }
    }

    public void removeTag(String tag) {
        if (tag != null) {
            String trimmedTag = tag.trim().toLowerCase();
            if (this.tags.remove(trimmedTag)) {
                this.lastModified = LocalDateTime.now();
                this.updatedAt = LocalDateTime.now();
            }
        }
    }

    public void clearTags() {
        if (!this.tags.isEmpty()) {
            this.tags.clear();
            this.lastModified = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
        }
    }

    public boolean hasTag(String tag) {
        return tag != null && this.tags.contains(tag.trim().toLowerCase());
    }

    // Utility methods
    public String getFileExtension() {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        }
        return fileType != null ? fileType.toLowerCase() : "";
    }

    public String getFileSizeFormatted() {
        if (fileSize == null || fileSize == 0) {
            return "0 bytes";
        }
        
        String[] units = {"bytes", "KB", "MB", "GB"};
        double size = fileSize.doubleValue();
        int unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return String.format("%.1f %s", size, units[unitIndex]);
    }

    // JPA lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (dateCreated == null) {
            dateCreated = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        lastModified = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        LocalDateTime now = LocalDateTime.now();
        lastModified = now;
        updatedAt = now;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public DocumentType getType() {
        return type;
    }

    public void setType(DocumentType type) {
        this.type = type;
    }

    public DocumentCategory getCategory() {
        return category;
    }

    public void setCategory(DocumentCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
        if (fileData != null) {
            this.fileSize = (long) fileData.length;
        }
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    // Backward compatibility getters/setters
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
        // Try to map to enum if possible
        if (documentType != null && this.type == null) {
            try {
                this.type = DocumentType.valueOf(documentType.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep the string value, enum will be null
            }
        }
    }

    public LocalDateTime getCreatedAt() {
        return createdAt != null ? createdAt : dateCreated;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt != null ? updatedAt : lastModified;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // toString, equals, and hashCode
    @Override
    public String toString() {
        return "StaffDocument{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", fileName='" + fileName + '\'' +
                ", type=" + type +
                ", category=" + category +
                ", status=" + status +
                ", creator='" + creator + '\'' +
                ", dateCreated=" + dateCreated +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StaffDocument that = (StaffDocument) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}