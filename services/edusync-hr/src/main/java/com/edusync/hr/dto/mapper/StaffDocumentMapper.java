package com.edusync.hr.dto.mapper;

import com.edusync.hr.dto.StaffDocumentDTO;
import com.edusync.hr.entity.StaffDocument;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StaffDocumentMapper {
    
    /**
     * Converts StaffDocument entity to StaffDocumentDTO
     *
     * @param staffDocument the entity to convert
     * @return the converted DTO
     */
    public StaffDocumentDTO toDTO(StaffDocument staffDocument) {
        if (staffDocument == null) {
            return null;
        }
        
        StaffDocumentDTO dto = new StaffDocumentDTO();
        dto.setId(staffDocument.getId());
        dto.setStaffId(staffDocument.getStaff() != null ? staffDocument.getStaff().getId() : null);
        dto.setDocumentType(staffDocument.getDocumentType());
        dto.setFileName(staffDocument.getFileName());
        dto.setDescription(staffDocument.getDescription());
        dto.setFilePath(staffDocument.getFilePath());
        dto.setFileSize(staffDocument.getFileSize());
        dto.setUpdatedAt(staffDocument.getUpdatedAt());
        
        return dto;
    }
    
    /**
     * Converts StaffDocumentDTO to StaffDocument entity
     * Note: This method doesn't set the Staff entity - it should be set separately
     *
     * @param dto the DTO to convert
     * @return the converted entity
     */
    public static StaffDocument toEntity(StaffDocumentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        StaffDocument entity = new StaffDocument();
        entity.setId(dto.getId());
        // Note: Staff entity should be set separately using staffService
        entity.setDocumentType(dto.getDocumentType());
        entity.setFileName(dto.getFileName());
        entity.setDescription(dto.getDescription());
        entity.setFilePath(dto.getFilePath());
        entity.setFileSize(dto.getFileSize());
        entity.setUpdatedAt(dto.getUpdatedAt());

        return entity;
    }
    
    /**
     * Updates an existing StaffDocument entity with data from StaffDocumentDTO
     *
     * @param existingEntity the existing entity to update
     * @param dto the DTO containing new data
     * @return the updated entity
     */
    public StaffDocument updateEntity(StaffDocument existingEntity, StaffDocumentDTO dto) {
        if (existingEntity == null || dto == null) {
            return existingEntity;
        }
        
        // Update only modifiable fields
        if (dto.getDocumentType() != null) {
            existingEntity.setDocumentType(dto.getDocumentType());
        }
        if (dto.getFileName() != null) {
            existingEntity.setFileName(dto.getFileName());
        }
        if (dto.getDescription() != null) {
            existingEntity.setDescription(dto.getDescription());
        }
        if (dto.getFilePath() != null) {
            existingEntity.setFilePath(dto.getFilePath());
        }
        if (dto.getFileSize() != null) {
            existingEntity.setFileSize(dto.getFileSize());
        }
        
        // Always update the timestamp
        existingEntity.setUpdatedAt(LocalDateTime.now());
        
        return existingEntity;
    }
    
    /**
     * Converts a list of StaffDocument entities to a list of StaffDocumentDTOs
     *
     * @param staffDocuments the list of entities to convert
     * @return the list of converted DTOs
     */
    public List<StaffDocumentDTO> toDTOList(List<StaffDocument> staffDocuments) {
        if (staffDocuments == null) {
            return null;
        }
        
        return staffDocuments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Converts a list of StaffDocumentDTOs to a list of StaffDocument entities
     *
     * @param dtos the list of DTOs to convert
     * @return the list of converted entities
     */
    public List<StaffDocument> toEntityList(List<StaffDocumentDTO> dtos) {
        if (dtos == null) {
            return null;
        }
        
        return dtos.stream()
                .map(StaffDocumentMapper::toEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Creates a new StaffDocumentDTO for file upload scenarios
     *
     * @param staffId the ID of the staff member
     * @param documentType the type of document
     * @param fileName the name of the file
     * @param description the description of the document
     * @param fileSize the size of the file
     * @param mimeType the MIME type of the file
     * @param uploadedBy the user who uploaded the file
     * @return a new StaffDocumentDTO
     */
    public StaffDocumentDTO createUploadDTO(Long staffId, String documentType, String fileName,
                                           String description, Long fileSize, String mimeType,
                                           String uploadedBy) {
        StaffDocumentDTO dto = new StaffDocumentDTO();
        dto.setStaffId(staffId);
        dto.setDocumentType(documentType);
        dto.setFileName(fileName);
        dto.setDescription(description);
        dto.setFileSize(fileSize);
        dto.setMimeType(mimeType);
        dto.setUploadedBy(uploadedBy);
        dto.setUploadedAt(LocalDateTime.now());
        dto.setIsActive(true);
        
        return dto;
    }
}