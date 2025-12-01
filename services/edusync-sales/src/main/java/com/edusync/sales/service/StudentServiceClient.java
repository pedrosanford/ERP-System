package com.edusync.sales.service;

import com.edusync.sales.entity.Lead;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class StudentServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(StudentServiceClient.class);

    private final RestTemplate restTemplate;

    @Value("${student.service.url:http://localhost:8083}")
    private String studentServiceUrl;

    @Autowired
    public StudentServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Creates a student from a lead when the lead is moved to enrolled status
     */
    public Map<String, Object> createStudentFromLead(Lead lead) {
        try {
            // Generate student ID if not already set
            String studentId = lead.getStudentId();
            if (studentId == null || studentId.isEmpty()) {
                // Generate student ID from name and current year
                String firstName = lead.getName().split(" ")[0];
                String lastName = lead.getName().contains(" ") 
                    ? lead.getName().substring(lead.getName().lastIndexOf(" ") + 1)
                    : "";
                int year = LocalDate.now().getYear();
                studentId = String.format("STU-%s%s-%d", 
                    firstName.substring(0, Math.min(3, firstName.length())).toUpperCase(),
                    lastName.substring(0, Math.min(3, lastName.length())).toUpperCase(),
                    year);
            }

            // Prepare student data
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("studentId", studentId);
            
            // Parse name - assume format is "FirstName LastName"
            String[] nameParts = lead.getName().split(" ", 2);
            studentData.put("firstName", nameParts[0]);
            studentData.put("lastName", nameParts.length > 1 ? nameParts[1] : "");
            
            // Email is required - use a generated one if not provided
            String email = lead.getEmail();
            if (email == null || email.isEmpty()) {
                email = studentId.toLowerCase() + "@edusync.local";
            }
            studentData.put("email", email);
            studentData.put("phone", lead.getPhone());
            studentData.put("program", lead.getProgram() != null ? lead.getProgram() : "General");
            studentData.put("enrollmentDate", LocalDate.now());
            studentData.put("dateOfBirth", LocalDate.now().minusYears(15)); // Default, should be updated
            studentData.put("status", "ACTIVE");
            studentData.put("feeStatus", "PENDING");
            
            // Add guardian info if parent name is available
            if (lead.getParentName() != null && !lead.getParentName().isEmpty()) {
                studentData.put("guardianName", lead.getParentName());
            }

            // Make HTTP request to Student Service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(studentData, headers);

            String url = studentServiceUrl + "/students";
            logger.info("Calling Student Service at: {}", url);
            logger.info("Student data: {}", studentData);
            
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Student created successfully: {}", response.getBody());
                @SuppressWarnings("unchecked")
                Map<String, Object> body = response.getBody();
                return body;
            } else {
                String errorMsg = "Failed to create student: " + response.getStatusCode();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
        } catch (org.springframework.web.client.RestClientException e) {
            String errorMsg = "Error calling Student Service at " + studentServiceUrl + ": " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        } catch (Exception e) {
            String errorMsg = "Error creating student from lead: " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        }
    }
}

