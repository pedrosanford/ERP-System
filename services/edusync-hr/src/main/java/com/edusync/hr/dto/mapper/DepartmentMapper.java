package com.edusync.hr.dto.mapper;

import com.edusync.hr.dto.DepartmentDTO;
import com.edusync.hr.entity.Department;

public class DepartmentMapper {
    
    public static Department toEntity(DepartmentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Department department = new Department();
        department.setName(dto.getName());
        department.setCode(dto.getCode());
        department.setDescription(dto.getDescription());
        department.setHeadOfDepartmentId(dto.getHeadOfDepartmentId());
        department.setParentDepartmentId(dto.getParentDepartmentId());
        department.setBudget(dto.getBudget());
        department.setIsActive(dto.getIsActive());
        
        return department;
    }
    
    public static DepartmentDTO toDTO(Department entity) {
        if (entity == null) {
            return null;
        }
        
        DepartmentDTO dto = new DepartmentDTO();
        dto.setName(entity.getName());
        dto.setCode(entity.getCode());
        dto.setDescription(entity.getDescription());
        dto.setHeadOfDepartmentId(entity.getHeadOfDepartmentId());
        dto.setParentDepartmentId(entity.getParentDepartmentId());
        dto.setBudget(entity.getBudget());
        dto.setIsActive(entity.getIsActive());
        
        return dto;
    }
    
    public static void updateEntityFromDTO(Department entity, DepartmentDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setHeadOfDepartmentId(dto.getHeadOfDepartmentId());
        entity.setParentDepartmentId(dto.getParentDepartmentId());
        entity.setBudget(dto.getBudget());
        entity.setIsActive(dto.getIsActive());
    }
}

