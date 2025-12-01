package com.edusync.hr.service;

import com.edusync.hr.entity.StaffEvaluation;
import com.edusync.hr.entity.StaffEvaluation.EvaluationStatus;
import com.edusync.hr.repository.StaffEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class StaffEvaluationService {

    private final StaffEvaluationRepository evaluationRepository;

    @Autowired
    public StaffEvaluationService(StaffEvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public List<StaffEvaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Optional<StaffEvaluation> getEvaluationById(Long id) {
        return evaluationRepository.findById(id);
    }

    public List<StaffEvaluation> getEvaluationsByStaffId(Long staffId) {
        return evaluationRepository.findByStaffId(staffId);
    }

    public List<StaffEvaluation> getEvaluationsByEvaluatorId(Long evaluatorId) {
        return evaluationRepository.findByEvaluatorId(evaluatorId);
    }

    public List<StaffEvaluation> getEvaluationsByStatus(EvaluationStatus status) {
        return evaluationRepository.findByStatus(status);
    }

    public List<StaffEvaluation> getEvaluationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return evaluationRepository.findByEvaluationDateBetween(startDate, endDate);
    }

    public StaffEvaluation createEvaluation(StaffEvaluation evaluation) {
        if (evaluation.getStatus() == null) {
            evaluation.setStatus(EvaluationStatus.DRAFT);
        }
        return evaluationRepository.save(evaluation);
    }

    public StaffEvaluation updateEvaluation(Long id, StaffEvaluation evaluationDetails) {
        StaffEvaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found with id: " + id));

        evaluation.setStaffId(evaluationDetails.getStaffId());
        evaluation.setEvaluatorId(evaluationDetails.getEvaluatorId());
        evaluation.setEvaluationDate(evaluationDetails.getEvaluationDate());
        evaluation.setPeriodStart(evaluationDetails.getPeriodStart());
        evaluation.setPeriodEnd(evaluationDetails.getPeriodEnd());
        evaluation.setPerformanceScore(evaluationDetails.getPerformanceScore());
        evaluation.setRating(evaluationDetails.getRating());
        evaluation.setComments(evaluationDetails.getComments());
        evaluation.setStrengths(evaluationDetails.getStrengths());
        evaluation.setAreasForImprovement(evaluationDetails.getAreasForImprovement());
        evaluation.setGoals(evaluationDetails.getGoals());
        evaluation.setStatus(evaluationDetails.getStatus());

        return evaluationRepository.save(evaluation);
    }

    public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }
        evaluationRepository.deleteById(id);
    }
}
