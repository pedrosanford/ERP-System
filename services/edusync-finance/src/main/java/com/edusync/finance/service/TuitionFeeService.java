package com.edusync.finance.service;

import com.edusync.finance.entity.TuitionFee;
import com.edusync.finance.entity.TuitionFee.TuitionFeeStatus;
import com.edusync.finance.repository.TuitionFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class TuitionFeeService {

    private final TuitionFeeRepository tuitionFeeRepository;

    @Autowired
    public TuitionFeeService(TuitionFeeRepository tuitionFeeRepository) {
        this.tuitionFeeRepository = tuitionFeeRepository;
    }

    public List<TuitionFee> getAllTuitionFees() {
        return tuitionFeeRepository.findAll();
    }

    public Optional<TuitionFee> getTuitionFeeById(Long id) {
        return tuitionFeeRepository.findById(id);
    }

    public List<TuitionFee> getTuitionFeesByStudentId(String studentId) {
        return tuitionFeeRepository.findByStudentId(studentId);
    }

    public Optional<TuitionFee> getTuitionFeeByStudentIdAndYear(String studentId, String academicYear) {
        return tuitionFeeRepository.findByStudentIdAndAcademicYear(studentId, academicYear);
    }

    public List<TuitionFee> getTuitionFeesByStatus(TuitionFeeStatus status) {
        return tuitionFeeRepository.findByStatus(status);
    }

    public TuitionFee createTuitionFee(TuitionFee tuitionFee) {
        // Check if tuition fee already exists for this student and academic year
        Optional<TuitionFee> existing = tuitionFeeRepository.findByStudentIdAndAcademicYear(
                tuitionFee.getStudentId(), tuitionFee.getAcademicYear());

        if (existing.isPresent()) {
            throw new IllegalArgumentException(
                    "Tuition fee already exists for student " + tuitionFee.getStudentId() +
                    " in academic year " + tuitionFee.getAcademicYear());
        }

        // Set default status if not provided
        if (tuitionFee.getStatus() == null) {
            tuitionFee.setStatus(TuitionFeeStatus.ACTIVE);
        }

        return tuitionFeeRepository.save(tuitionFee);
    }

    public TuitionFee updateTuitionFee(Long id, TuitionFee tuitionFeeDetails) {
        TuitionFee tuitionFee = tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tuition fee not found with id: " + id));

        tuitionFee.setStudentId(tuitionFeeDetails.getStudentId());
        tuitionFee.setAcademicYear(tuitionFeeDetails.getAcademicYear());
        tuitionFee.setProgram(tuitionFeeDetails.getProgram());
        tuitionFee.setBaseTuition(tuitionFeeDetails.getBaseTuition());
        tuitionFee.setAdditionalFees(tuitionFeeDetails.getAdditionalFees());
        tuitionFee.setDiscountAmount(tuitionFeeDetails.getDiscountAmount());
        tuitionFee.setPaymentPlan(tuitionFeeDetails.getPaymentPlan());
        tuitionFee.setStatus(tuitionFeeDetails.getStatus());

        return tuitionFeeRepository.save(tuitionFee);
    }

    public TuitionFee updateTuitionFeeStatus(Long id, TuitionFeeStatus status) {
        TuitionFee tuitionFee = tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tuition fee not found with id: " + id));

        tuitionFee.setStatus(status);
        return tuitionFeeRepository.save(tuitionFee);
    }

    public void deleteTuitionFee(Long id) {
        if (!tuitionFeeRepository.existsById(id)) {
            throw new RuntimeException("Tuition fee not found with id: " + id);
        }
        tuitionFeeRepository.deleteById(id);
    }

    // Statistics methods
    public BigDecimal getTotalActiveTuitionByStudent(String studentId) {
        BigDecimal total = tuitionFeeRepository.sumActiveTuitionByStudentId(studentId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public long getTuitionFeeCountByStatus(TuitionFeeStatus status) {
        return tuitionFeeRepository.countByStatus(status);
    }
}
