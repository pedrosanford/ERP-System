package com.edusync.hr.controller;

import com.edusync.hr.entity.Document;
import com.edusync.hr.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/hr/documents")
public class DocumentController {
    
    private final DocumentService documentService;
    
    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }
    
    // Get all documents
    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllActiveDocuments());
    }
    
    // Get document by ID
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable @NonNull Long id) {
        return documentService.getDocumentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Get documents by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Document>> getDocumentsByType(@PathVariable String type) {
        if (type == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(documentService.getDocumentsByType(type));
    }
    
    // Search documents
    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(@RequestParam @NonNull String query) {
        return ResponseEntity.ok(documentService.searchDocuments(query));
    }
    
    // Upload document
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
        @RequestParam("file") MultipartFile file,
        @RequestParam("documentType") String documentType,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "creator", required = false) String creator,
        @RequestParam(value = "staffId", required = false) Long staffId
    ) {
        if (file == null || documentType == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Document document = documentService.uploadDocument(file, documentType, description, creator, staffId);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Download document
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable @NonNull Long id) throws MalformedURLException {
        Resource resource = documentService.downloadDocument(id);
        Document document = documentService.getDocumentById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        String contentType = document.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + document.getFileName() + "\"")
            .body(resource);
    }
    
    // Update document
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
        @PathVariable @NonNull Long id,
        @RequestBody Document documentDetails
    ) {
        if (documentDetails == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Document updated = documentService.updateDocument(id, documentDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete document
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable @NonNull Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get available document types
    @GetMapping("/types")
    public ResponseEntity<List<String>> getDocumentTypes() {
        return ResponseEntity.ok(documentService.getAvailableDocumentTypes());
    }
}

