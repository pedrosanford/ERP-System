package com.edusync.student.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/stats")
    public Map<String, Object> getStudentStats() {
        return Map.of(
            "totalStudents", 2847,
            "activeStudents", 2847,
            "newEnrollments", 12,
            "graduatedStudents", 156,
            "averageGrade", 85.5
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-student");
    }
}
