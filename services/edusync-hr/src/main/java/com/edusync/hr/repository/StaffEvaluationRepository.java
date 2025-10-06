package com.edusync.hr.repository;

import com.edusync.hr.entity.StaffEvaluation;
import com.edusync.hr.entity.StaffEvaluation.EvaluationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffEvaluationRepository extends JpaRepository<StaffEvaluation, Long> {
    
    List<StaffEvaluation> findByStaffId(Long staffId);
    
    List<StaffEvaluation> findByEvaluatorId(Long evaluatorId);
    
    List<StaffEvaluation> findByStatus(EvaluationStatus status);
    
    List<StaffEvaluation> findByStaffIdAndStatus(Long staffId, EvaluationStatus status);
    
    List<StaffEvaluation> findByEvaluationDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM StaffEvaluation e WHERE e.staffId = ?1 ORDER BY e.evaluationDate DESC")
    List<StaffEvaluation> findLatestEvaluationsByStaff(Long staffId);
}

