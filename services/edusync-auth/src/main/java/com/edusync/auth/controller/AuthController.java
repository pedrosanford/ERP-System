package com.edusync.auth.controller;

import com.edusync.auth.dto.*;
import com.edusync.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        AuthResponse response = authService.getCurrentUser();
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile() {
        return ResponseEntity.ok(authService.getProfile());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(request));
    }
    
    @PutMapping("/profile/password")
    public ResponseEntity<Map<String, String>> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        authService.updatePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
    
    @PostMapping(value = "/profile/avatar", consumes = {"multipart/form-data"})
    public ResponseEntity<UserProfileDTO> uploadAvatar(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(authService.updateAvatar(file));
    }
    
    @DeleteMapping("/profile/avatar")
    public ResponseEntity<UserProfileDTO> deleteAvatar() {
        return ResponseEntity.ok(authService.removeAvatar());
    }
}
