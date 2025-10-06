package com.edusync.hr.service;

import com.edusync.hr.entity.Staff.StaffStatus;
import com.edusync.hr.repository.StaffRepository;
import com.edusync.hr.repository.DepartmentRepository;
import com.edusync.hr.repository.LeaveRequestRepository;
import com.edusync.hr.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class HrStatsService {
    
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    
    @Autowired
    public HrStatsService(
        StaffRepository staffRepository,
        DepartmentRepository departmentRepository,
        LeaveRequestRepository leaveRequestRepository,
        PayrollRepository payrollRepository
    ) {
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
    }
    
    public Map<String, Object> getHrStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Staff statistics
        long totalStaff = staffRepository.count();
        long activeStaff = staffRepository.countActiveStaff();
        
        // Calculate new hires (last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long newHires = staffRepository.findByStatus(StaffStatus.ACTIVE)
            .stream()
            .filter(staff -> staff.getHireDate().isAfter(thirtyDaysAgo))
            .count();
        
        // Department statistics
        long departments = departmentRepository.findByIsActiveTrue().size();
        
        // Calculate average salary
        BigDecimal averageSalary = staffRepository.findByStatus(StaffStatus.ACTIVE)
            .stream()
            .filter(staff -> staff.getSalary() != null)
            .map(staff -> staff.getSalary())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (activeStaff > 0) {
            averageSalary = averageSalary.divide(
                BigDecimal.valueOf(activeStaff), 
                2, 
                RoundingMode.HALF_UP
            );
        }
        
        // Pending leave requests
        long pendingLeaveRequests = leaveRequestRepository.countPendingRequests();
        
        // Pending payrolls
        long pendingPayrolls = payrollRepository.countPendingPayrolls();
        
        stats.put("totalStaff", totalStaff);
        stats.put("activeStaff", activeStaff);
        stats.put("newHires", newHires);
        stats.put("departments", departments);
        stats.put("averageSalary", averageSalary);
        stats.put("pendingLeaveRequests", pendingLeaveRequests);
        stats.put("pendingPayrolls", pendingPayrolls);
        
        return stats;
    }
    
    public Map<String, Object> getDepartmentStats(Long departmentId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalStaff = staffRepository.findByDepartmentId(departmentId).size();
        long activeStaff = staffRepository.countActiveStaffByDepartment(departmentId);
        
        // Calculate average salary for department
        BigDecimal averageSalary = staffRepository.findByDepartmentIdAndStatus(departmentId, StaffStatus.ACTIVE)
            .stream()
            .filter(staff -> staff.getSalary() != null)
            .map(staff -> staff.getSalary())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (activeStaff > 0) {
            averageSalary = averageSalary.divide(
                BigDecimal.valueOf(activeStaff), 
                2, 
                RoundingMode.HALF_UP
            );
        }
        
        stats.put("totalStaff", totalStaff);
        stats.put("activeStaff", activeStaff);
        stats.put("averageSalary", averageSalary);
        
        return stats;
    }
}

