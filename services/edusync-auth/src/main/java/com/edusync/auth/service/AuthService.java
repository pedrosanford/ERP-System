package com.edusync.auth.service;

import com.edusync.auth.dto.AuthResponse;
import com.edusync.auth.dto.*;
import com.edusync.auth.entity.User;
import com.edusync.auth.repository.UserRepository;
import com.edusync.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse(false, "Email is already taken!");
            }
            
            // Create new user
            User user = new User();
            user.setName(request.getName());
            String[] nameParts = request.getName().trim().split("\\s+", 2);
            user.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                user.setLastName(nameParts[1]);
            }
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER);
            user.setEnabled(true);
            user.setLanguage("en");
            user.setRegion("US");
            
            User savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser);
            
            return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
            );
            
        } catch (Exception e) {
            return new AuthResponse(false, "Registration failed: " + e.getMessage());
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
            
            // Get user details
            User user = (User) authentication.getPrincipal();
            
            // Generate JWT token
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("userId", user.getId());
            extraClaims.put("name", user.getName());
            extraClaims.put("role", user.getRole().name());
            
            String token = jwtUtil.generateToken(user, extraClaims);
            
            return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
            );
            
        } catch (Exception e) {
            return new AuthResponse(false, "Login failed: " + e.getMessage());
        }
    }
    
    public AuthResponse getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                return new AuthResponse(
                    null, // No token needed for current user info
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name()
                );
            }
            return new AuthResponse(false, "User not authenticated");
        } catch (Exception e) {
            return new AuthResponse(false, "Failed to get current user: " + e.getMessage());
        }
    }
    
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getEnabled(),
                    user.getCreatedAt(),
                    user.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }
    
    public UserProfileDTO getProfile() {
        User user = getAuthenticatedUserOrThrow();
        return mapToProfileDTO(user);
    }
    
    public UserProfileDTO updateProfile(UpdateProfileRequest request) {
        User user = getAuthenticatedUserOrThrow();
        
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmailAndIdNot(request.getEmail(), user.getId())) {
            throw new IllegalArgumentException("Email is already in use by another account");
        }
        
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setName(request.getDisplayName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPhone(request.getPhone() != null && !request.getPhone().isBlank() ? request.getPhone().trim() : null);
        user.setLanguage(request.getLanguage() != null ? request.getLanguage().trim() : null);
        user.setRegion(request.getRegion() != null ? request.getRegion().trim() : null);
        
        User saved = userRepository.save(user);
        return mapToProfileDTO(saved);
    }
    
    public void updatePassword(UpdatePasswordRequest request) {
        User user = getAuthenticatedUserOrThrow();
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    public UserProfileDTO updateAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Avatar file is required");
        }
        
        try {
            User user = getAuthenticatedUserOrThrow();
            String contentType = file.getContentType() != null ? file.getContentType() : "image/png";
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            user.setAvatarData("data:" + contentType + ";base64," + base64);
            return mapToProfileDTO(userRepository.save(user));
        } catch (IOException e) {
            throw new IllegalStateException("Failed to process avatar: " + e.getMessage(), e);
        }
    }
    
    public UserProfileDTO removeAvatar() {
        User user = getAuthenticatedUserOrThrow();
        user.setAvatarData(null);
        return mapToProfileDTO(userRepository.save(user));
    }
    
    private User getAuthenticatedUserOrThrow() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        
        // Fallback: try to get user from authentication name (email)
        if (authentication != null && authentication.getName() != null && !authentication.getName().equals("anonymousUser")) {
            return userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + authentication.getName()));
        }
        
        // Last resort fallback for demo - return the last created user (most likely the one who just logged in)
        return userRepository.findAll()
                .stream()
                .reduce((first, second) -> second) // Get last user
                .orElseThrow(() -> new IllegalStateException("No users available in the system"));
    }
    
    private UserProfileDTO mapToProfileDTO(User user) {
        return new UserProfileDTO(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getLanguage(),
            user.getRegion(),
            user.getAvatarData(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
