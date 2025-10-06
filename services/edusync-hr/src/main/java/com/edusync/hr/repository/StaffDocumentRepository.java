package com.edusync.hr.repository;

import com.edusync.hr.entity.StaffDocument;
import com.edusync.hr.entity.StaffDocument.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffDocumentRepository extends JpaRepository<StaffDocument, Long> {
    
    List<StaffDocument> findByStaffId(Long staffId);
    
    List<StaffDocument> findByDocumentType(DocumentType documentType);
    
    List<StaffDocument> findByStaffIdAndDocumentType(Long staffId, DocumentType documentType);
    
    List<StaffDocument> findByUploadedBy(Long uploadedBy);
    
    @Query("SELECT d FROM StaffDocument d WHERE d.expiryDate IS NOT NULL AND d.expiryDate <= ?1")
    List<StaffDocument> findExpiredDocuments(LocalDate date);
    
    @Query("SELECT d FROM StaffDocument d WHERE d.expiryDate IS NOT NULL AND d.expiryDate BETWEEN ?1 AND ?2")
    List<StaffDocument> findDocumentsExpiringBetween(LocalDate startDate, LocalDate endDate);
}

