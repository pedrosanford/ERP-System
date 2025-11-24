package com.edusync.sales.repository;

import com.edusync.sales.entity.Lead;
import com.edusync.sales.entity.Lead.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    Optional<Lead> findByEmail(String email);

    Optional<Lead> findByStudentId(String studentId);

    List<Lead> findByStatus(String status);

    List<Lead> findByPriority(Priority priority);

    List<Lead> findByAssignedRecruiter(String assignedRecruiter);

    List<Lead> findByProgram(String program);

    List<Lead> findBySource(String source);

    List<Lead> findByEnrollmentTerm(String enrollmentTerm);

    List<Lead> findByScholarshipRequested(Boolean scholarshipRequested);

    @Query("SELECT l FROM Lead l WHERE " +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.parentName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Lead> searchLeads(@Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.priority = :priority")
    long countByPriority(@Param("priority") Priority priority);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.scholarshipRequested = true")
    long countScholarshipRequests();

    @Query("SELECT SUM(l.estimatedTuitionValue) FROM Lead l WHERE l.status NOT IN ('lost', 'enrolled')")
    Double sumPotentialRevenue();

    boolean existsByEmail(String email);
}
