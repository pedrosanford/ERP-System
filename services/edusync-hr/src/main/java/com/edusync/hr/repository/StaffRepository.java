package com.edusync.hr.repository;

import com.edusync.hr.entity.Staff;
import com.edusync.hr.entity.Staff.StaffStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    
    Optional<Staff> findByEmployeeId(String employeeId);
    
    Optional<Staff> findByEmail(String email);
    
    Optional<Staff> findByUserId(Long userId);
    
    List<Staff> findByDepartmentId(Long departmentId);
    
    List<Staff> findByStatus(StaffStatus status);
    
    List<Staff> findByDepartmentIdAndStatus(Long departmentId, StaffStatus status);
    
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.status = 'ACTIVE'")
    Long countActiveStaff();
    
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.departmentId = ?1 AND s.status = 'ACTIVE'")
    Long countActiveStaffByDepartment(Long departmentId);
}

