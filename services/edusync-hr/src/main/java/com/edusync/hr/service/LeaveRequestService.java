package com.edusync.hr.service;

import com.edusync.hr.entity.LeaveRequest;
import com.edusync.hr.entity.LeaveRequest.LeaveStatus;
import com.edusync.hr.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LeaveRequestService {
    
    private final LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }
    
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
    
    public Optional<LeaveRequest> getLeaveRequestById(@NonNull Long id) {
        return leaveRequestRepository.findById(id);
    }
    
    public List<LeaveRequest> getLeaveRequestsByStaff(@NonNull Long staffId) {
        return leaveRequestRepository.findByStaffId(staffId);
    }
    
    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }
    
    public List<LeaveRequest> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }
    
    public Long countPendingRequests() {
        return leaveRequestRepository.countPendingRequests();
    }
    
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        // Calculate days count
        long daysCount = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        leaveRequest.setDaysCount((int) daysCount);
        
        // Check for overlapping leaves
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingLeaves(
            leaveRequest.getStaffId(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate()
        );
        
        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException(
                "Leave request overlaps with existing approved leave for this staff member"
            );
        }
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest updateLeaveRequest(@NonNull Long id, LeaveRequest leaveRequestDetails) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Leave request not found with id: " + id));
        
        // Recalculate days count
        long daysCount = ChronoUnit.DAYS.between(
            leaveRequestDetails.getStartDate(), 
            leaveRequestDetails.getEndDate()
        ) + 1;
        
        leaveRequest.setLeaveType(leaveRequestDetails.getLeaveType());
        leaveRequest.setStartDate(leaveRequestDetails.getStartDate());
        leaveRequest.setEndDate(leaveRequestDetails.getEndDate());
        leaveRequest.setDaysCount((int) daysCount);
        leaveRequest.setReason(leaveRequestDetails.getReason());
        leaveRequest.setStatus(leaveRequestDetails.getStatus());
        leaveRequest.setNotes(leaveRequestDetails.getNotes());
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest approveLeaveRequest(@NonNull Long id, @NonNull Long approvedBy) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Leave request not found with id: " + id));
        
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approvedBy);
        leaveRequest.setApprovalDate(LocalDate.now());
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest rejectLeaveRequest(@NonNull Long id, @NonNull Long rejectedBy, String notes) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Leave request not found with id: " + id));
        
        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(rejectedBy);
        leaveRequest.setApprovalDate(LocalDate.now());
        leaveRequest.setNotes(notes);
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public void deleteLeaveRequest(@NonNull Long id) {
        leaveRequestRepository.deleteById(id);
    }
}

