package com.edusync.hr.service;

import com.edusync.hr.entity.Document;
import com.edusync.hr.exception.ResourceNotFoundException;
import com.edusync.hr.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.lang.NonNull;
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
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    
    @Value("${app.file.upload-dir:uploads/documents}")
    private String uploadDir;
    
    @Value("${app.file.max-size:10485760}") // 10MB default
    private long maxFileSize;
    
    @Value("${app.file.allowed-types:pdf,doc,docx,jpg,jpeg,png,txt}")
    private String allowedFileTypes;
    
    // Available document types
    private static final List<String> DOCUMENT_TYPES = Arrays.asList(
        "CONTRACT", "RESUME", "ID_COPY", "CERTIFICATE", "PERFORMANCE_REVIEW",
        "MEDICAL_CERTIFICATE", "TRAINING_CERTIFICATE", "REFERENCE_LETTER",
        "BANK_DETAILS", "POLICY", "AGREEMENT", "REPORT", "FORM", "OTHER"
    );
    
    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }
    
    /**
     * Get all documents
     */
    @Transactional(readOnly = true)
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    
    /**
     * Get all active documents
     */
    @Transactional(readOnly = true)
    public List<Document> getAllActiveDocuments() {
        return documentRepository.findAllActive();
    }
    
    /**
     * Get document by ID
     */
    @Transactional(readOnly = true)
    public Optional<Document> getDocumentById(@NonNull Long documentId) {
        return documentRepository.findById(documentId);
    }
    
    /**
     * Get documents by type
     */
    @Transactional(readOnly = true)
    public List<Document> getDocumentsByType(@NonNull String documentType) {
        return documentRepository.findByDocumentType(documentType.toUpperCase());
    }
    
    /**
     * Search documents
     */
    @Transactional(readOnly = true)
    public List<Document> searchDocuments(@NonNull String searchTerm) {
        return documentRepository.searchDocuments(searchTerm);
    }
    
    /**
     * Upload a document
     */
    public Document uploadDocument(
            @NonNull MultipartFile file,
            @NonNull String documentType,
            String description,
            String creator,
            Long staffId) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Cannot upload empty file");
            }
            
            if (file.getSize() > maxFileSize) {
                throw new IllegalArgumentException("File size exceeds maximum allowed size of " + 
                    (maxFileSize / 1024 / 1024) + "MB");
            }
            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new IllegalArgumentException("Invalid file name");
            }
            
            // Validate file type
            String fileExtension = getFileExtension(originalFilename);
            if (!isAllowedFileType(fileExtension)) {
                throw new IllegalArgumentException("File type not allowed: " + fileExtension);
            }
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(uniqueFilename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create document entity
            Document document = new Document();
            document.setTitle(originalFilename);
            document.setFileName(originalFilename);
            document.setDocumentType(documentType.toUpperCase());
            document.setDescription(description != null ? description : originalFilename);
            document.setCreator(creator != null ? creator : "System");
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setStaffId(staffId);
            document.setDateCreated(LocalDateTime.now());
            document.setLastModified(LocalDateTime.now());
            
            return documentRepository.save(document);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }
    
    /**
     * Update a document
     */
    public Document updateDocument(@NonNull Long documentId, @NonNull Document documentDetails) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        if (documentDetails.getTitle() != null) {
            document.setTitle(documentDetails.getTitle());
        }
        if (documentDetails.getDescription() != null) {
            document.setDescription(documentDetails.getDescription());
        }
        if (documentDetails.getDocumentType() != null) {
            document.setDocumentType(documentDetails.getDocumentType());
        }
        if (documentDetails.getStatus() != null) {
            document.setStatus(documentDetails.getStatus());
        }
        
        document.setLastModified(LocalDateTime.now());
        
        return documentRepository.save(document);
    }
    
    /**
     * Delete a document
     */
    public void deleteDocument(@NonNull Long documentId) {
        Document document = Objects.requireNonNull(
            documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId)),
            "Document must not be null"
        );
        
        // Delete physical file if it exists
        deletePhysicalFile(document);
        
        // Delete from database
        documentRepository.delete(document);
    }
    
    /**
     * Download a document file
     */
    @Transactional(readOnly = true)
    public Resource downloadDocument(@NonNull Long documentId) throws MalformedURLException {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        if (document.getFilePath() == null) {
            throw new ResourceNotFoundException("Document file path not found for document id: " + documentId);
        }
        
        try {
            Path filePath = Paths.get(document.getFilePath());
            
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("Physical file not found at path: " + document.getFilePath());
            }
            
            java.net.URI uri = Objects.requireNonNull(filePath.toUri(), "URI must not be null");
            Resource resource = new UrlResource(uri);
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Document file is not readable at path: " + document.getFilePath());
            }
        } catch (MalformedURLException e) {
            throw new MalformedURLException("Error creating URL for file: " + e.getMessage());
        }
    }
    
    /**
     * Get available document types
     */
    public List<String> getAvailableDocumentTypes() {
        return DOCUMENT_TYPES;
    }
    
    // Helper methods
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
    
    private boolean isAllowedFileType(String extension) {
        String[] allowedExtensions = allowedFileTypes.split(",");
        return Arrays.asList(allowedExtensions).contains(extension.toLowerCase());
    }
    
    private void deletePhysicalFile(Document document) {
        if (document.getFilePath() != null && !document.getFilePath().isEmpty()) {
            try {
                Path filePath = Paths.get(document.getFilePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log the error but don't throw exception
                System.err.println("Failed to delete physical file: " + e.getMessage());
            }
        }
    }
}

