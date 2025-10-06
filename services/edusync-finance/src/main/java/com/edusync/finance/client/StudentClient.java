package com.edusync.finance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "edusync-student", path = "/student")
public interface StudentClient {
    
    @GetMapping("/students/{id}")
    StudentResponse getStudentById(@PathVariable("id") Long id);
    
    class StudentResponse {
        private Long id;
        private String studentId;
        private String firstName;
        private String lastName;
        private String status;
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getStudentId() {
            return studentId;
        }
        
        public void setStudentId(String studentId) {
            this.studentId = studentId;
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
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}

