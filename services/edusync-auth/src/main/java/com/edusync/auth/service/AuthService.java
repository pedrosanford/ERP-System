package com.edusync.auth.service;

import com.edusync.auth.dto.AuthResponse;
import com.edusync.auth.dto.LoginRequest;
import com.edusync.auth.dto.RegisterRequest;
import com.edusync.auth.dto.UserDTO;
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
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER);
            user.setEnabled(true);
            
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
}
