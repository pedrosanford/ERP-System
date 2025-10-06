package com.edusync.hr.repository;

import com.edusync.hr.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    Optional<Department> findByCode(String code);
    
    Optional<Department> findByName(String name);
    
    List<Department> findByIsActiveTrue();
    
    List<Department> findByParentDepartmentId(Long parentDepartmentId);
    
    List<Department> findByHeadOfDepartmentId(Long headOfDepartmentId);
}

