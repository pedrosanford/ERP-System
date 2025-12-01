package com.edusync.sales.service;

import com.edusync.sales.entity.Lead;
import com.edusync.sales.entity.Lead.Priority;
import com.edusync.sales.exception.ResourceNotFoundException;
import com.edusync.sales.repository.LeadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class LeadService {

    private static final Logger logger = LoggerFactory.getLogger(LeadService.class);

    private final LeadRepository leadRepository;
    private final StudentServiceClient studentServiceClient;
    private final FinanceServiceClient financeServiceClient;

    @Autowired
    public LeadService(LeadRepository leadRepository,
                      StudentServiceClient studentServiceClient,
                      FinanceServiceClient financeServiceClient) {
        this.leadRepository = leadRepository;
        this.studentServiceClient = studentServiceClient;
        this.financeServiceClient = financeServiceClient;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @SuppressWarnings("null")
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

    @SuppressWarnings("null")
    public Lead updateLead(Long id, Lead leadDetails) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        // Check email uniqueness if it's being changed
        if (leadDetails.getEmail() != null && !leadDetails.getEmail().equals(lead.getEmail())) {
            if (leadRepository.existsByEmail(leadDetails.getEmail())) {
                throw new IllegalArgumentException("Email " + leadDetails.getEmail() + " is already in use");
            }
        }

        // Store old status to check if it changed to "enrolled"
        String oldStatus = lead.getStatus();
        String newStatus = leadDetails.getStatus();

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

        Lead savedLead = leadRepository.save(lead);

        // Check if status changed to "enrolled" and process enrollment
        if (!"enrolled".equalsIgnoreCase(oldStatus) && "enrolled".equalsIgnoreCase(newStatus)) {
            processEnrollment(savedLead);
        }

        return savedLead;
    }

    @SuppressWarnings("null")
    public Lead updateLeadStatus(Long id, String newStatus) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        String oldStatus = lead.getStatus();
        logger.info("Updating lead ID: {} status from '{}' to '{}'", id, oldStatus, newStatus);
        
        lead.setStatus(newStatus);
        Lead savedLead = leadRepository.save(lead);

        // Check if status changed to "enrolled" and process enrollment
        if (!"enrolled".equalsIgnoreCase(oldStatus) && "enrolled".equalsIgnoreCase(newStatus)) {
            logger.info("Lead ID: {} moved to enrolled status, processing enrollment...", id);
            processEnrollment(savedLead);
        } else {
            logger.debug("Lead ID: {} status change does not trigger enrollment (old: '{}', new: '{}')", 
                id, oldStatus, newStatus);
        }

        return savedLead;
    }

    /**
     * Processes enrollment: creates student and tuition invoice
     */
    private void processEnrollment(Lead lead) {
        try {
            logger.info("=== Processing enrollment for lead ID: {}, Name: {} ===", lead.getId(), lead.getName());
            logger.info("Lead details - Email: {}, Estimated Tuition: {}, Scholarship: {}", 
                lead.getEmail(), 
                lead.getEstimatedTuitionValue(), 
                lead.getScholarshipAmount());

            // Check if student already exists (by studentId in lead)
            if (lead.getStudentId() != null && !lead.getStudentId().isEmpty()) {
                logger.info("Lead already has studentId: {}, skipping student creation", lead.getStudentId());
                // Still create invoice if needed - use the studentId string
                try {
                    financeServiceClient.createTuitionInvoice(lead, lead.getStudentId());
                    logger.info("✓ Created tuition invoice for existing student ID: {}", lead.getStudentId());
                } catch (Exception e) {
                    logger.error("✗ Failed to create invoice for existing student: {}", e.getMessage(), e);
                    throw e; // Re-throw to be caught by outer catch
                }
                return;
            }

            // Create student from lead
            logger.info("Creating student in Student Service...");
            Map<String, Object> createdStudent;
            try {
                createdStudent = studentServiceClient.createStudentFromLead(lead);
                logger.info("✓ Student created successfully: {}", createdStudent);
            } catch (Exception e) {
                logger.error("✗ Failed to create student: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to create student: " + e.getMessage(), e);
            }
            
            // Extract student ID from response
            Object studentIdForInvoice = null;
            if (createdStudent.containsKey("id")) {
                studentIdForInvoice = createdStudent.get("id");
                logger.info("Extracted student database ID: {}", studentIdForInvoice);
            } else if (createdStudent.containsKey("studentId")) {
                studentIdForInvoice = createdStudent.get("studentId");
                logger.info("Extracted student ID string: {}", studentIdForInvoice);
            }

            // Update lead with student ID (use the database ID or studentId string)
            if (createdStudent.containsKey("studentId")) {
                String studentIdStr = String.valueOf(createdStudent.get("studentId"));
                lead.setStudentId(studentIdStr);
                leadRepository.save(lead);
                logger.info("✓ Updated lead with studentId: {}", studentIdStr);
            } else if (createdStudent.containsKey("id")) {
                // Use the database ID as studentId if studentId field is not present
                String studentIdStr = String.valueOf(createdStudent.get("id"));
                lead.setStudentId(studentIdStr);
                leadRepository.save(lead);
                logger.info("✓ Updated lead with database ID as studentId: {}", studentIdStr);
            }

            // Create tuition invoice
            if (studentIdForInvoice != null) {
                logger.info("Creating tuition invoice in Finance Service...");
                try {
                    financeServiceClient.createTuitionInvoice(lead, studentIdForInvoice);
                    logger.info("✓ Successfully created student and invoice for lead ID: {}", lead.getId());
                } catch (Exception e) {
                    logger.error("✗ Failed to create invoice: {}", e.getMessage(), e);
                    throw new RuntimeException("Failed to create invoice: " + e.getMessage(), e);
                }
            } else {
                logger.error("✗ Could not create invoice: studentId is null for lead ID: {}", lead.getId());
                throw new RuntimeException("Student ID is null after student creation");
            }

            logger.info("=== Enrollment processing completed successfully for lead ID: {} ===", lead.getId());

        } catch (Exception e) {
            logger.error("✗✗✗ ERROR processing enrollment for lead ID: {} - {}", lead.getId(), e.getMessage(), e);
            logger.error("Stack trace:", e);
            // Don't throw exception - enrollment status should still be saved even if automation fails
            // This allows manual processing later. The error is logged for admin review.
        }
    }

    @SuppressWarnings("null")
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
