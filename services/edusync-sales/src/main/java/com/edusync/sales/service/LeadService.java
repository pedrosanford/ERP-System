package com.edusync.sales.service;

import com.edusync.sales.entity.Lead;
import com.edusync.sales.entity.Lead.Priority;
import com.edusync.sales.exception.ResourceNotFoundException;
import com.edusync.sales.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LeadService {

    private final LeadRepository leadRepository;

    @Autowired
    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }

    public Optional<Lead> getLeadByEmail(String email) {
        return leadRepository.findByEmail(email);
    }

    public List<Lead> getLeadsByStatus(String status) {
        return leadRepository.findByStatus(status);
    }

    public List<Lead> getLeadsByPriority(Priority priority) {
        return leadRepository.findByPriority(priority);
    }

    public List<Lead> getLeadsByRecruiter(String recruiter) {
        return leadRepository.findByAssignedRecruiter(recruiter);
    }

    public List<Lead> searchLeads(String searchTerm) {
        return leadRepository.searchLeads(searchTerm);
    }

    public Lead createLead(Lead lead) {
        // Validate unique email
        if (lead.getEmail() != null && leadRepository.existsByEmail(lead.getEmail())) {
            throw new IllegalArgumentException("Lead with email " + lead.getEmail() + " already exists");
        }

        // Set default status if not provided
        if (lead.getStatus() == null || lead.getStatus().isEmpty()) {
            lead.setStatus("inquiry");
        }

        return leadRepository.save(lead);
    }

    public Lead updateLead(Long id, Lead leadDetails) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        // Check email uniqueness if it's being changed
        if (leadDetails.getEmail() != null && !leadDetails.getEmail().equals(lead.getEmail())) {
            if (leadRepository.existsByEmail(leadDetails.getEmail())) {
                throw new IllegalArgumentException("Email " + leadDetails.getEmail() + " is already in use");
            }
        }

        // Update fields
        lead.setName(leadDetails.getName());
        lead.setParentName(leadDetails.getParentName());
        lead.setGrade(leadDetails.getGrade());
        lead.setProgram(leadDetails.getProgram());
        lead.setSource(leadDetails.getSource());
        lead.setEnrollmentTerm(leadDetails.getEnrollmentTerm());
        lead.setStatus(leadDetails.getStatus());
        lead.setPriority(leadDetails.getPriority());
        lead.setPhone(leadDetails.getPhone());
        lead.setEmail(leadDetails.getEmail());
        lead.setEstimatedTuitionValue(leadDetails.getEstimatedTuitionValue());
        lead.setAssignedRecruiter(leadDetails.getAssignedRecruiter());
        lead.setPreferredContactMethod(leadDetails.getPreferredContactMethod());
        lead.setFollowUpDate(leadDetails.getFollowUpDate());
        lead.setNextFollowUpDate(leadDetails.getNextFollowUpDate());
        lead.setStatusNotes(leadDetails.getStatusNotes());
        lead.setApplicationFeeStatus(leadDetails.getApplicationFeeStatus());
        lead.setSubmissionDate(leadDetails.getSubmissionDate());
        lead.setInterviewDate(leadDetails.getInterviewDate());
        lead.setInterviewer(leadDetails.getInterviewer());
        lead.setEnrollmentDeadline(leadDetails.getEnrollmentDeadline());
        lead.setOfferLetterSent(leadDetails.getOfferLetterSent());
        lead.setTuitionPaid(leadDetails.getTuitionPaid());
        lead.setStudentId(leadDetails.getStudentId());
        lead.setDormAssigned(leadDetails.getDormAssigned());
        lead.setScholarshipRequested(leadDetails.getScholarshipRequested());
        lead.setScholarshipAmount(leadDetails.getScholarshipAmount());
        lead.setScholarshipNotes(leadDetails.getScholarshipNotes());

        return leadRepository.save(lead);
    }

    public Lead updateLeadStatus(Long id, String newStatus) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        lead.setStatus(newStatus);
        return leadRepository.save(lead);
    }

    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead", "id", id);
        }
        leadRepository.deleteById(id);
    }

    // Statistics methods
    public long getTotalLeadsCount() {
        return leadRepository.count();
    }

    public long getLeadsCountByStatus(String status) {
        return leadRepository.countByStatus(status);
    }

    public long getScholarshipRequestsCount() {
        return leadRepository.countScholarshipRequests();
    }

    public Double getPotentialRevenue() {
        Double revenue = leadRepository.sumPotentialRevenue();
        return revenue != null ? revenue : 0.0;
    }
}
