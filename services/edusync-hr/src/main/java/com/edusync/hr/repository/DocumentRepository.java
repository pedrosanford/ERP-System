package com.edusync.hr.repository;

import com.edusync.hr.entity.Document;
import com.edusync.hr.entity.Document.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByStatus(DocumentStatus status);
    
    List<Document> findByDocumentType(String documentType);
    
    List<Document> findByCreator(String creator);
    
    Optional<Document> findByFileName(String fileName);
    
    List<Document> findByStaffId(Long staffId);
    
    @Query("SELECT d FROM Document d WHERE d.status = 'ACTIVE' ORDER BY d.dateCreated DESC")
    List<Document> findAllActive();
    
    @Query("SELECT d FROM Document d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.fileName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Document> searchDocuments(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT d FROM Document d WHERE d.status = 'ACTIVE' ORDER BY d.dateCreated DESC")
    List<Document> findRecentDocuments();
}

