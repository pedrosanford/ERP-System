package com.edusync.finance.service;

import com.edusync.finance.entity.Scholarship;
import com.edusync.finance.entity.Scholarship.ScholarshipStatus;
import com.edusync.finance.repository.ScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("null")
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    @Autowired
    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    public Optional<Scholarship> getScholarshipById(Long id) {
        return scholarshipRepository.findById(id);
    }

    public List<Scholarship> getScholarshipsByStudentId(String studentId) {
        return scholarshipRepository.findByStudentId(studentId);
    }

    public List<Scholarship> getScholarshipsByStatus(ScholarshipStatus status) {
        return scholarshipRepository.findByStatus(status);
    }

    public List<Scholarship> getScholarshipsBySourceModule(String sourceModule) {
        return scholarshipRepository.findBySourceModule(sourceModule);
    }

    public Scholarship createScholarship(Scholarship scholarship) {
        // Set default status if not provided
        if (scholarship.getStatus() == null) {
            scholarship.setStatus(ScholarshipStatus.ACTIVE);
        }

        return scholarshipRepository.save(scholarship);
    }

    public Scholarship updateScholarship(Long id, Scholarship scholarshipDetails) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + id));

        scholarship.setStudentId(scholarshipDetails.getStudentId());
        scholarship.setScholarshipType(scholarshipDetails.getScholarshipType());
        scholarship.setAmount(scholarshipDetails.getAmount());
        scholarship.setPercentage(scholarshipDetails.getPercentage());
        scholarship.setAcademicYear(scholarshipDetails.getAcademicYear());
        scholarship.setStatus(scholarshipDetails.getStatus());
        scholarship.setNotes(scholarshipDetails.getNotes());

        return scholarshipRepository.save(scholarship);
    }

    public Scholarship updateScholarshipStatus(Long id, ScholarshipStatus status) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scholarship not found with id: " + id));

        scholarship.setStatus(status);
        return scholarshipRepository.save(scholarship);
    }

    public void deleteScholarship(Long id) {
        if (!scholarshipRepository.existsById(id)) {
            throw new RuntimeException("Scholarship not found with id: " + id);
        }
        scholarshipRepository.deleteById(id);
    }

    // Statistics methods
    public BigDecimal getTotalActiveScholarshipsByStudent(String studentId) {
        BigDecimal total = scholarshipRepository.sumActiveScholarshipsByStudentId(studentId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public long getScholarshipCountByStatus(ScholarshipStatus status) {
        return scholarshipRepository.countByStatus(status);
    }
}
