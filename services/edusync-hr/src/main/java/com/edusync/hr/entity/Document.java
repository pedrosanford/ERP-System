package com.edusync.hr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 100)
    private String documentType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status = DocumentStatus.ACTIVE;

    private Long fileSize;

    @Column(nullable = false, length = 100)
    private String creator;

    @Column(nullable = false)
    private LocalDateTime dateCreated;

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Column(length = 500)
    private String filePath;

    @Column(length = 100)
    private String contentType;

    // Optional: link to staff if needed
    @Column
    private Long staffId;

    // Enums
    public enum DocumentStatus {
        ACTIVE, ARCHIVED, EXPIRED, DELETED
    }

    // Constructors
    public Document() {
        this.dateCreated = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
        this.status = DocumentStatus.ACTIVE;
    }

    public Document(String title, String fileName, String documentType, String description, String creator) {
        this();
        this.title = title;
        this.fileName = fileName;
        this.documentType = documentType;
        this.description = description;
        this.creator = creator;
    }

    // Business Methods
    public void archive() {
        this.status = DocumentStatus.ARCHIVED;
        this.lastModified = LocalDateTime.now();
    }

    public void reactivate() {
        this.status = DocumentStatus.ACTIVE;
        this.lastModified = LocalDateTime.now();
    }

    public boolean isActive() {
        return this.status == DocumentStatus.ACTIVE;
    }

    public boolean hasFilePath() {
        return this.filePath != null && !this.filePath.trim().isEmpty();
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
        lastModified = now;
    }

    @PreUpdate
    protected void onUpdate() {
        lastModified = LocalDateTime.now();
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

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
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

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    // toString, equals, and hashCode
    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", fileName='" + fileName + '\'' +
                ", documentType='" + documentType + '\'' +
                ", status=" + status +
                ", creator='" + creator + '\'' +
                ", dateCreated=" + dateCreated +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Document document = (Document) o;
        return Objects.equals(id, document.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

