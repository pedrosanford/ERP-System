package com.edusync.hr.service;

import com.edusync.hr.entity.Staff;
import com.edusync.hr.entity.StaffDocument;
import com.edusync.hr.exception.ResourceNotFoundException;
import com.edusync.hr.exception.UnauthorizedOperationException;
import com.edusync.hr.repository.StaffDocumentRepository;
import com.edusync.hr.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class StaffDocumentService {

    private final StaffDocumentRepository staffDocumentRepository;
    private final StaffRepository staffRepository;
    
    @Value("${app.file.upload-dir:uploads/staff-documents}")
    private String uploadDir;
    
    @Value("${app.file.max-size:10485760}") // 10MB default
    private long maxFileSize;
    
    @Value("${app.file.allowed-types:pdf,doc,docx,jpg,jpeg,png,txt}")
    private String allowedFileTypes;
    
    // Available document types
    private static final List<String> DOCUMENT_TYPES = Arrays.asList(
        "CONTRACT", "RESUME", "ID_COPY", "CERTIFICATE", "PERFORMANCE_REVIEW",
        "MEDICAL_CERTIFICATE", "TRAINING_CERTIFICATE", "REFERENCE_LETTER",
        "BANK_DETAILS", "EMERGENCY_CONTACT", "OTHER"
    );
    
    @Autowired
    public StaffDocumentService(
            StaffDocumentRepository staffDocumentRepository,
            StaffRepository staffRepository
    ) {
        this.staffDocumentRepository = staffDocumentRepository;
        this.staffRepository = staffRepository;
    }
    
    /**
     * Get all documents for a specific staff member
     */
    @Transactional(readOnly = true)
    public List<StaffDocument> getDocumentsByStaffId(Long staffId) {
        validateStaffExists(staffId);
        return staffDocumentRepository.findByStaffIdOrderByCreatedAtDesc(staffId);
    }
    
    /**
     * Get documents by staff ID and document type
     */
    @Transactional(readOnly = true)
    public List<StaffDocument> getDocumentsByStaffIdAndType(Long staffId, String documentType) {
        validateStaffExists(staffId);
        validateDocumentType(documentType);
        return staffDocumentRepository.findByStaffIdAndDocumentTypeOrderByCreatedAtDesc(staffId, documentType.toUpperCase());
    }
    
    /**
     * Get a specific document by ID
     */
    @Transactional(readOnly = true)
    public Optional<StaffDocument> getDocumentById(Long documentId) {
        return staffDocumentRepository.findById(documentId);
    }
    
    /**
     * Upload a document file for a staff member
     */
    public StaffDocument uploadDocument(Long staffId, MultipartFile file, String documentType, String description) {
        validateFile(file);
        Staff staff = validateStaffExists(staffId);
        validateDocumentType(documentType);
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + 
                (fileExtension.isEmpty() ? "" : "." + fileExtension);
            
            // Save file to disk
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create document entity
            StaffDocument document = new StaffDocument();
            document.setStaff(staff);
            document.setDocumentType(documentType.toUpperCase());
            document.setFileName(originalFilename);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setDescription(description);
            document.setCreatedAt(LocalDateTime.now());
            document.setUpdatedAt(LocalDateTime.now());
            
            return staffDocumentRepository.save(document);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }
    
    /**
     * Update document metadata
     */
    public StaffDocument updateDocument(Long staffId, Long documentId, StaffDocument documentDetails) {
        validateStaffExists(staffId);
        
        StaffDocument document = staffDocumentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Verify document belongs to the specified staff
        validateDocumentOwnership(document, staffId);
        
        // Update allowed fields
        if (documentDetails.getDocumentType() != null) {
            validateDocumentType(documentDetails.getDocumentType());
            document.setDocumentType(documentDetails.getDocumentType().toUpperCase());
        }
        
        if (documentDetails.getDescription() != null) {
            document.setDescription(documentDetails.getDescription());
        }
        
        if (documentDetails.getFileName() != null) {
            document.setFileName(documentDetails.getFileName());
        }
        
        document.setUpdatedAt(LocalDateTime.now());
        
        return staffDocumentRepository.save(document);
    }
    
    /**
     * Delete a document
     */
    public void deleteDocument(Long staffId, Long documentId) {
        validateStaffExists(staffId);
        
        StaffDocument document = staffDocumentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Verify document belongs to the specified staff
        validateDocumentOwnership(document, staffId);
        
        // Delete physical file if it exists
        deletePhysicalFile(document);
        
        // Delete from database
        staffDocumentRepository.delete(document);
    }
    
    /**
     * Download a document file
     */
    @Transactional(readOnly = true)
    public Resource downloadDocument(Long staffId, Long documentId) throws MalformedURLException {
        validateStaffExists(staffId);
        
        StaffDocument document = staffDocumentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Verify document belongs to the specified staff
        validateDocumentOwnership(document, staffId);
        
        if (document.getFilePath() == null) {
            throw new ResourceNotFoundException("Document file path not found for document id: " + documentId);
        }
        
        try {
            Path filePath = Paths.get(document.getFilePath());
            
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("Physical file not found at path: " + document.getFilePath());
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Document file is not readable at path: " + document.getFilePath());
            }
        } catch (Exception e) {
            if (e instanceof ResourceNotFoundException) {
                throw e;
            }
            throw new RuntimeException("Failed to download document: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get available document types
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableDocumentTypes() {
        return List.copyOf(DOCUMENT_TYPES);
    }
    
    // ============ PRIVATE HELPER METHODS ============
    
    private Staff validateStaffExists(Long staffId) {
        if (staffId == null) {
            throw new IllegalArgumentException("Staff ID cannot be null");
        }
        
        return staffRepository.findById(staffId)
            .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + staffId));
    }
    
    private void validateDocumentType(String documentType) {
        if (documentType == null || documentType.trim().isEmpty()) {
            throw new IllegalArgumentException("Document type cannot be null or empty");
        }
        
        if (!DOCUMENT_TYPES.contains(documentType.toUpperCase())) {
            throw new IllegalArgumentException("Invalid document type: '" + documentType + 
                "'. Valid types are: " + String.join(", ", DOCUMENT_TYPES));
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                String.format("File size (%d bytes) exceeds maximum allowed size (%d bytes)", 
                    file.getSize(), maxFileSize));
        }
        
        String fileExtension = getFileExtension(file.getOriginalFilename());
        if (!isAllowedFileType(fileExtension)) {
            throw new IllegalArgumentException(
                String.format("File type '%s' is not allowed. Allowed types: %s", 
                    fileExtension, allowedFileTypes));
        }
    }
    
    private void validateDocumentOwnership(StaffDocument document, Long staffId) {
        if (document.getStaff() == null || !document.getStaff().getId().equals(staffId)) {
            throw new UnauthorizedOperationException(
                String.format("Document with id %d does not belong to staff member with id %d", 
                    document.getId(), staffId));
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
    
    private boolean isAllowedFileType(String fileExtension) {
        if (fileExtension.isEmpty()) {
            return false;
        }
        return Arrays.asList(allowedFileTypes.toLowerCase().split(","))
            .contains(fileExtension.toLowerCase());
    }
    
    private void deletePhysicalFile(StaffDocument document) {
        if (document.getFilePath() != null) {
            try {
                Path filePath = Paths.get(document.getFilePath());
                boolean deleted = Files.deleteIfExists(filePath);
                if (!deleted) {
                    // Log warning but don't fail the operation
                    System.err.println("Warning: Physical file not found for deletion: " + document.getFilePath());
                }
            } catch (IOException e) {
                // Log the error but don't fail the database operation
                System.err.println("Error deleting physical file: " + e.getMessage());
            }
        }
    }
}