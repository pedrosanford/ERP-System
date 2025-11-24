package com.edusync.sales.controller;

import com.edusync.sales.service.SalesStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesStatsService salesStatsService;

    @Autowired
    public SalesController(SalesStatsService salesStatsService) {
        this.salesStatsService = salesStatsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSalesStats() {
        return ResponseEntity.ok(salesStatsService.getSalesStats());
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-sales");
    }
}
