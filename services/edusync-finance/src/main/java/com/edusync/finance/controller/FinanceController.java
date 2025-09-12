package com.edusync.finance.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @GetMapping("/stats")
    public Map<String, Object> getFinanceStats() {
        return Map.of(
            "totalRevenue", 45230.00,
            "monthlyRevenue", 45230.00,
            "revenueGrowth", 15.0,
            "totalExpenses", 32370.00,
            "expenseGrowth", 0.7,
            "netProfit", 12860.00,
            "profitMargin", 68.0
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-finance");
    }
}
