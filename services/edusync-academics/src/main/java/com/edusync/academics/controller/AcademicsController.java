package com.edusync.academics.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/academics")
public class AcademicsController {

    @GetMapping("/stats")
    public Map<String, Object> getAcademicsStats() {
        return Map.of(
            "totalCourses", 156,
            "activeCourses", 142,
            "totalPrograms", 24,
            "enrolledStudents", 2847,
            "graduatedStudents", 156,
            "averageGrade", 85.5,
            "courseCompletionRate", 92.3,
            "facultyMembers", 89
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-academics");
    }
}
