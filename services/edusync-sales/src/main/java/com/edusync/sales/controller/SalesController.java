package com.edusync.sales.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @GetMapping("/stats")
    public Map<String, Object> getSalesStats() {
        return Map.of(
            "totalSales", 125430.00,
            "monthlySales", 125430.00,
            "salesGrowth", 22.5,
            "newLeads", 45,
            "conversionRate", 18.5,
            "averageDealSize", 2787.33,
            "salesTarget", 150000.00,
            "targetProgress", 83.6
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-sales");
    }
}
