package com.edusync.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class StaffDocumentDTO {
    
    private Long id;
    
    @NotNull(message = "Staff ID is required")
    private Long staffId;
    
    @NotBlank(message = "Document type is required")
    @Size(max = 50, message = "Document type must not exceed 50 characters")
    private String documentType;
    
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must not exceed 255 characters")
    private String fileName;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private String filePath;
    
    private Long fileSize;
    
    private String mimeType;
    
    private LocalDateTime uploadedAt;
    
    private String uploadedBy;
    
    private LocalDateTime updatedAt;
    
    private String updatedBy;
    
    private Boolean isActive;
    
    // Default constructor
    public StaffDocumentDTO() {
        this.isActive = true;
    }
    
    // Constructor without ID (for creation)
    public StaffDocumentDTO(Long staffId, String documentType, String fileName, String description) {
        this();
        this.staffId = staffId;
        this.documentType = documentType;
        this.fileName = fileName;
        this.description = description;
    }
    
    // Full constructor
    public StaffDocumentDTO(Long id, Long staffId, String documentType, String fileName, 
                           String description, String filePath, Long fileSize, String mimeType,
                           LocalDateTime uploadedAt, String uploadedBy, LocalDateTime updatedAt, 
                           String updatedBy, Boolean isActive) {
        this.id = id;
        this.staffId = staffId;
        this.documentType = documentType;
        this.fileName = fileName;
        this.description = description;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.uploadedAt = uploadedAt;
        this.uploadedBy = uploadedBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
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
    
    public String getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
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
    
    public String getMimeType() {
        return mimeType;
    }
    
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    @Override
    public String toString() {
        return "StaffDocumentDTO{" +
                "id=" + id +
                ", staffId=" + staffId +
                ", documentType='" + documentType + '\'' +
                ", fileName='" + fileName + '\'' +
                ", description='" + description + '\'' +
                ", filePath='" + filePath + '\'' +
                ", fileSize=" + fileSize +
                ", mimeType='" + mimeType + '\'' +
                ", uploadedAt=" + uploadedAt +
                ", uploadedBy='" + uploadedBy + '\'' +
                ", updatedAt=" + updatedAt +
                ", updatedBy='" + updatedBy + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}