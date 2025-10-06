package com.edusync.hr.dto.mapper;

import com.edusync.hr.dto.StaffDTO;
import com.edusync.hr.entity.Staff;

public class StaffMapper {
    
    public static Staff toEntity(StaffDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Staff staff = new Staff();
        staff.setEmployeeId(dto.getEmployeeId());
        staff.setFirstName(dto.getFirstName());
        staff.setLastName(dto.getLastName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setDateOfBirth(dto.getDateOfBirth());
        staff.setGender(dto.getGender());
        staff.setAddress(dto.getAddress());
        staff.setHireDate(dto.getHireDate());
        staff.setEmploymentType(dto.getEmploymentType());
        staff.setPosition(dto.getPosition());
        staff.setDepartmentId(dto.getDepartmentId());
        staff.setSalary(dto.getSalary());
        staff.setStatus(dto.getStatus());
        staff.setTerminationDate(dto.getTerminationDate());
        staff.setUserId(dto.getUserId());
        
        return staff;
    }
    
    public static StaffDTO toDTO(Staff entity) {
        if (entity == null) {
            return null;
        }
        
        StaffDTO dto = new StaffDTO();
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setGender(entity.getGender());
        dto.setAddress(entity.getAddress());
        dto.setHireDate(entity.getHireDate());
        dto.setEmploymentType(entity.getEmploymentType());
        dto.setPosition(entity.getPosition());
        dto.setDepartmentId(entity.getDepartmentId());
        dto.setSalary(entity.getSalary());
        dto.setStatus(entity.getStatus());
        dto.setTerminationDate(entity.getTerminationDate());
        dto.setUserId(entity.getUserId());
        
        return dto;
    }
    
    public static void updateEntityFromDTO(Staff entity, StaffDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        
        entity.setEmployeeId(dto.getEmployeeId());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setGender(dto.getGender());
        entity.setAddress(dto.getAddress());
        entity.setHireDate(dto.getHireDate());
        entity.setEmploymentType(dto.getEmploymentType());
        entity.setPosition(dto.getPosition());
        entity.setDepartmentId(dto.getDepartmentId());
        entity.setSalary(dto.getSalary());
        entity.setStatus(dto.getStatus());
        entity.setTerminationDate(dto.getTerminationDate());
    }
}

