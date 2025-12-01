package com.edusync.auth.dto;

import java.time.LocalDateTime;

public class UserProfileDTO {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String displayName;
    private String email;
    private String phone;
    private String language;
    private String region;
    private String avatarData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public UserProfileDTO() {
    }
    
    public UserProfileDTO(Long id, String firstName, String lastName, String displayName, String email,
                          String phone, String language, String region, String avatarData,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.displayName = displayName;
        this.email = email;
        this.phone = phone;
        this.language = language;
        this.region = region;
        this.avatarData = avatarData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public String getAvatarData() {
        return avatarData;
    }
    
    public void setAvatarData(String avatarData) {
        this.avatarData = avatarData;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

