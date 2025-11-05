package com.edusync.hr.repository;

import com.edusync.hr.entity.StaffDocument;
import com.edusync.hr.entity.StaffDocument.DocumentCategory;
import com.edusync.hr.entity.StaffDocument.DocumentStatus;
import com.edusync.hr.entity.StaffDocument.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffDocumentRepository extends JpaRepository<StaffDocument, Long> {
    
    List<StaffDocument> findByCategory(DocumentCategory category);
    
    List<StaffDocument> findByType(DocumentType type);
    
    List<StaffDocument> findByStatus(DocumentStatus status);
    
    List<StaffDocument> findByCreator(String creator);
    
    @Query("SELECT d FROM StaffDocument d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "EXISTS (SELECT t FROM d.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<StaffDocument> searchDocuments(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT d FROM StaffDocument d WHERE " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "EXISTS (SELECT t FROM d.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :searchTerm, '%'))))")
    List<StaffDocument> findDocumentsByCategoryAndSearch(
        @Param("category") DocumentCategory category, 
        @Param("searchTerm") String searchTerm
    );
    
    Optional<StaffDocument> findByFileName(String fileName);

    List<StaffDocument> findByStaffIdOrderByCreatedAtDesc(Long staffId);

    List<StaffDocument> findByStaffIdAndDocumentTypeOrderByCreatedAtDesc(Long staffId, String upperCase);

    List<StaffDocument> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    long countByDocumentType(String upperCase);
}