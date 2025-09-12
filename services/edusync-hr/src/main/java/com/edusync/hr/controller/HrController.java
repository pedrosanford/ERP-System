package com.edusync.hr.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @GetMapping("/stats")
    public Map<String, Object> getHrStats() {
        return Map.of(
            "totalStaff", 89,
            "activeStaff", 89,
            "newHires", 5,
            "departments", 8,
            "averageSalary", 65000.00
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-hr");
    }
}
