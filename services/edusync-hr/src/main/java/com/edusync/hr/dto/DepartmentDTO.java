package com.edusync.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class DepartmentDTO {
    
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    private String name;
    
    @Size(max = 20, message = "Department code must not exceed 20 characters")
    private String code;
    
    private String description;
    private Long headOfDepartmentId;
    private Long parentDepartmentId;
    private BigDecimal budget;
    private Boolean isActive = true;
    
    // Constructors
    public DepartmentDTO() {}
    
    public DepartmentDTO(String name, String code) {
        this.name = name;
        this.code = code;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Long getHeadOfDepartmentId() {
        return headOfDepartmentId;
    }
    
    public void setHeadOfDepartmentId(Long headOfDepartmentId) {
        this.headOfDepartmentId = headOfDepartmentId;
    }
    
    public Long getParentDepartmentId() {
        return parentDepartmentId;
    }
    
    public void setParentDepartmentId(Long parentDepartmentId) {
        this.parentDepartmentId = parentDepartmentId;
    }
    
    public BigDecimal getBudget() {
        return budget;
    }
    
    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}

