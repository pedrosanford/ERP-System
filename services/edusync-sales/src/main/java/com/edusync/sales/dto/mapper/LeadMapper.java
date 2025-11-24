package com.edusync.sales.dto.mapper;

import com.edusync.sales.dto.LeadDTO;
import com.edusync.sales.entity.Lead;

public class LeadMapper {

    public static Lead toEntity(LeadDTO dto) {
        if (dto == null) {
            return null;
        }

        Lead lead = new Lead();
        lead.setName(dto.getName());
        lead.setParentName(dto.getParentName());
        lead.setGrade(dto.getGrade());
        lead.setProgram(dto.getProgram());
        lead.setSource(dto.getSource());
        lead.setEnrollmentTerm(dto.getEnrollmentTerm());
        lead.setStatus(dto.getStatus());
        lead.setPriority(dto.getPriority());
        lead.setPhone(dto.getPhone());
        lead.setEmail(dto.getEmail());
        lead.setEstimatedTuitionValue(dto.getEstimatedTuitionValue());
        lead.setAssignedRecruiter(dto.getAssignedRecruiter());
        lead.setPreferredContactMethod(dto.getPreferredContactMethod());
        lead.setFollowUpDate(dto.getFollowUpDate());
        lead.setNextFollowUpDate(dto.getNextFollowUpDate());
        lead.setStatusNotes(dto.getStatusNotes());
        lead.setApplicationFeeStatus(dto.getApplicationFeeStatus());
        lead.setSubmissionDate(dto.getSubmissionDate());
        lead.setInterviewDate(dto.getInterviewDate());
        lead.setInterviewer(dto.getInterviewer());
        lead.setEnrollmentDeadline(dto.getEnrollmentDeadline());
        lead.setOfferLetterSent(dto.getOfferLetterSent());
        lead.setTuitionPaid(dto.getTuitionPaid());
        lead.setStudentId(dto.getStudentId());
        lead.setDormAssigned(dto.getDormAssigned());
        lead.setScholarshipRequested(dto.getScholarshipRequested());
        lead.setScholarshipAmount(dto.getScholarshipAmount());
        lead.setScholarshipNotes(dto.getScholarshipNotes());

        return lead;
    }

    public static LeadDTO toDTO(Lead entity) {
        if (entity == null) {
            return null;
        }

        LeadDTO dto = new LeadDTO();
        dto.setName(entity.getName());
        dto.setParentName(entity.getParentName());
        dto.setGrade(entity.getGrade());
        dto.setProgram(entity.getProgram());
        dto.setSource(entity.getSource());
        dto.setEnrollmentTerm(entity.getEnrollmentTerm());
        dto.setStatus(entity.getStatus());
        dto.setPriority(entity.getPriority());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setEstimatedTuitionValue(entity.getEstimatedTuitionValue());
        dto.setAssignedRecruiter(entity.getAssignedRecruiter());
        dto.setPreferredContactMethod(entity.getPreferredContactMethod());
        dto.setFollowUpDate(entity.getFollowUpDate());
        dto.setNextFollowUpDate(entity.getNextFollowUpDate());
        dto.setStatusNotes(entity.getStatusNotes());
        dto.setApplicationFeeStatus(entity.getApplicationFeeStatus());
        dto.setSubmissionDate(entity.getSubmissionDate());
        dto.setInterviewDate(entity.getInterviewDate());
        dto.setInterviewer(entity.getInterviewer());
        dto.setEnrollmentDeadline(entity.getEnrollmentDeadline());
        dto.setOfferLetterSent(entity.getOfferLetterSent());
        dto.setTuitionPaid(entity.getTuitionPaid());
        dto.setStudentId(entity.getStudentId());
        dto.setDormAssigned(entity.getDormAssigned());
        dto.setScholarshipRequested(entity.getScholarshipRequested());
        dto.setScholarshipAmount(entity.getScholarshipAmount());
        dto.setScholarshipNotes(entity.getScholarshipNotes());

        return dto;
    }

    public static void updateEntityFromDTO(Lead entity, LeadDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.getName());
        entity.setParentName(dto.getParentName());
        entity.setGrade(dto.getGrade());
        entity.setProgram(dto.getProgram());
        entity.setSource(dto.getSource());
        entity.setEnrollmentTerm(dto.getEnrollmentTerm());
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setEstimatedTuitionValue(dto.getEstimatedTuitionValue());
        entity.setAssignedRecruiter(dto.getAssignedRecruiter());
        entity.setPreferredContactMethod(dto.getPreferredContactMethod());
        entity.setFollowUpDate(dto.getFollowUpDate());
        entity.setNextFollowUpDate(dto.getNextFollowUpDate());
        entity.setStatusNotes(dto.getStatusNotes());
        entity.setApplicationFeeStatus(dto.getApplicationFeeStatus());
        entity.setSubmissionDate(dto.getSubmissionDate());
        entity.setInterviewDate(dto.getInterviewDate());
        entity.setInterviewer(dto.getInterviewer());
        entity.setEnrollmentDeadline(dto.getEnrollmentDeadline());
        entity.setOfferLetterSent(dto.getOfferLetterSent());
        entity.setTuitionPaid(dto.getTuitionPaid());
        entity.setStudentId(dto.getStudentId());
        entity.setDormAssigned(dto.getDormAssigned());
        entity.setScholarshipRequested(dto.getScholarshipRequested());
        entity.setScholarshipAmount(dto.getScholarshipAmount());
        entity.setScholarshipNotes(dto.getScholarshipNotes());
    }
}
