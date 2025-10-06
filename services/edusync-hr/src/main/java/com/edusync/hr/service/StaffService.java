package com.edusync.hr.service;

import com.edusync.hr.entity.Staff;
import com.edusync.hr.entity.Staff.StaffStatus;
import com.edusync.hr.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StaffService {
    
    private final StaffRepository staffRepository;
    
    @Autowired
    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }
    
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
    
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }
    
    public Optional<Staff> getStaffByEmployeeId(String employeeId) {
        return staffRepository.findByEmployeeId(employeeId);
    }
    
    public Optional<Staff> getStaffByEmail(String email) {
        return staffRepository.findByEmail(email);
    }
    
    public Optional<Staff> getStaffByUserId(Long userId) {
        return staffRepository.findByUserId(userId);
    }
    
    public List<Staff> getStaffByDepartment(Long departmentId) {
        return staffRepository.findByDepartmentId(departmentId);
    }
    
    public List<Staff> getStaffByStatus(StaffStatus status) {
        return staffRepository.findByStatus(status);
    }
    
    public List<Staff> getActiveStaff() {
        return staffRepository.findByStatus(StaffStatus.ACTIVE);
    }
    
    public Long countActiveStaff() {
        return staffRepository.countActiveStaff();
    }
    
    public Long countActiveStaffByDepartment(Long departmentId) {
        return staffRepository.countActiveStaffByDepartment(departmentId);
    }
    
    public Staff createStaff(Staff staff) {
        // Validate unique constraints
        if (staffRepository.findByEmployeeId(staff.getEmployeeId()).isPresent()) {
            throw new IllegalArgumentException("Staff with employee ID " + staff.getEmployeeId() + " already exists");
        }
        if (staffRepository.findByEmail(staff.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Staff with email " + staff.getEmail() + " already exists");
        }
        if (staff.getUserId() != null && staffRepository.findByUserId(staff.getUserId()).isPresent()) {
            throw new IllegalArgumentException("User ID " + staff.getUserId() + " is already linked to another staff member");
        }
        
        return staffRepository.save(staff);
    }
    
    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff staff = staffRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Staff not found with id: " + id));
        
        // Check unique constraints if values are being changed
        if (!staff.getEmployeeId().equals(staffDetails.getEmployeeId()) && 
            staffRepository.findByEmployeeId(staffDetails.getEmployeeId()).isPresent()) {
            throw new IllegalArgumentException("Staff with employee ID " + staffDetails.getEmployeeId() + " already exists");
        }
        
        if (!staff.getEmail().equals(staffDetails.getEmail()) && 
            staffRepository.findByEmail(staffDetails.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Staff with email " + staffDetails.getEmail() + " already exists");
        }
        
        staff.setEmployeeId(staffDetails.getEmployeeId());
        staff.setFirstName(staffDetails.getFirstName());
        staff.setLastName(staffDetails.getLastName());
        staff.setEmail(staffDetails.getEmail());
        staff.setPhone(staffDetails.getPhone());
        staff.setDateOfBirth(staffDetails.getDateOfBirth());
        staff.setGender(staffDetails.getGender());
        staff.setAddress(staffDetails.getAddress());
        staff.setHireDate(staffDetails.getHireDate());
        staff.setEmploymentType(staffDetails.getEmploymentType());
        staff.setPosition(staffDetails.getPosition());
        staff.setDepartmentId(staffDetails.getDepartmentId());
        staff.setSalary(staffDetails.getSalary());
        staff.setStatus(staffDetails.getStatus());
        staff.setTerminationDate(staffDetails.getTerminationDate());
        
        return staffRepository.save(staff);
    }
    
    public Staff terminateStaff(Long id, LocalDate terminationDate) {
        Staff staff = staffRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Staff not found with id: " + id));
        
        staff.setStatus(StaffStatus.TERMINATED);
        staff.setTerminationDate(terminationDate);
        
        return staffRepository.save(staff);
    }
    
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}

