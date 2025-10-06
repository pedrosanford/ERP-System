package com.edusync.hr.repository;

import com.edusync.hr.entity.LeaveRequest;
import com.edusync.hr.entity.LeaveRequest.LeaveStatus;
import com.edusync.hr.entity.LeaveRequest.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByStaffId(Long staffId);
    
    List<LeaveRequest> findByStatus(LeaveStatus status);
    
    List<LeaveRequest> findByStaffIdAndStatus(Long staffId, LeaveStatus status);
    
    List<LeaveRequest> findByLeaveType(LeaveType leaveType);
    
    List<LeaveRequest> findByApprovedBy(Long approvedBy);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.staffId = ?1 AND lr.status = 'APPROVED' AND " +
           "((lr.startDate <= ?3 AND lr.endDate >= ?2) OR (lr.startDate >= ?2 AND lr.startDate <= ?3))")
    List<LeaveRequest> findOverlappingLeaves(Long staffId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING'")
    Long countPendingRequests();
}

