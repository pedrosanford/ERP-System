package com.edusync.hr.service;

import com.edusync.hr.entity.Department;
import com.edusync.hr.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    
    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }
    
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    public List<Department> getActiveDepartments() {
        return departmentRepository.findByIsActiveTrue();
    }
    
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }
    
    public Optional<Department> getDepartmentByCode(String code) {
        return departmentRepository.findByCode(code);
    }
    
    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }
    
    public List<Department> getSubDepartments(Long parentDepartmentId) {
        return departmentRepository.findByParentDepartmentId(parentDepartmentId);
    }
    
    public Department createDepartment(Department department) {
        // Validate unique constraints
        if (department.getCode() != null && departmentRepository.findByCode(department.getCode()).isPresent()) {
            throw new IllegalArgumentException("Department with code " + department.getCode() + " already exists");
        }
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new IllegalArgumentException("Department with name " + department.getName() + " already exists");
        }
        return departmentRepository.save(department);
    }
    
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
        
        // Check if name is being changed and if new name already exists
        if (!department.getName().equals(departmentDetails.getName()) && 
            departmentRepository.findByName(departmentDetails.getName()).isPresent()) {
            throw new IllegalArgumentException("Department with name " + departmentDetails.getName() + " already exists");
        }
        
        // Check if code is being changed and if new code already exists
        if (departmentDetails.getCode() != null && 
            !departmentDetails.getCode().equals(department.getCode()) &&
            departmentRepository.findByCode(departmentDetails.getCode()).isPresent()) {
            throw new IllegalArgumentException("Department with code " + departmentDetails.getCode() + " already exists");
        }
        
        department.setName(departmentDetails.getName());
        department.setCode(departmentDetails.getCode());
        department.setDescription(departmentDetails.getDescription());
        department.setHeadOfDepartmentId(departmentDetails.getHeadOfDepartmentId());
        department.setParentDepartmentId(departmentDetails.getParentDepartmentId());
        department.setBudget(departmentDetails.getBudget());
        department.setIsActive(departmentDetails.getIsActive());
        
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
        
        // Soft delete - deactivate instead of actual deletion
        department.setIsActive(false);
        departmentRepository.save(department);
    }
    
    public void hardDeleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}

