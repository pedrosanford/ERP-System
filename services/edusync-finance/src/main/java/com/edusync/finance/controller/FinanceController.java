package com.edusync.finance.controller;

import com.edusync.finance.entity.Transaction;
import com.edusync.finance.entity.Transaction.TransactionStatus;
import com.edusync.finance.entity.Transaction.TransactionType;
import com.edusync.finance.entity.Scholarship;
import com.edusync.finance.entity.TuitionFee;
import com.edusync.finance.service.TransactionService;
import com.edusync.finance.service.FinanceStatsService;
import com.edusync.finance.service.ScholarshipService;
import com.edusync.finance.service.TuitionFeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/finance")
public class FinanceController {
    
    private final TransactionService transactionService;
    private final FinanceStatsService financeStatsService;
    private final ScholarshipService scholarshipService;
    private final TuitionFeeService tuitionFeeService;

    @Autowired
    public FinanceController(
            TransactionService transactionService,
            FinanceStatsService financeStatsService,
            ScholarshipService scholarshipService,
            TuitionFeeService tuitionFeeService) {
        this.transactionService = transactionService;
        this.financeStatsService = financeStatsService;
        this.scholarshipService = scholarshipService;
        this.tuitionFeeService = tuitionFeeService;
    }
    
    // Health check
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-finance");
    }
    
    // Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFinanceStats() {
        return ResponseEntity.ok(financeStatsService.getFinanceStats());
    }
    
    // Transaction endpoints
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
    
    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable @NonNull Long id) {
        return transactionService.getTransactionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/transactions/type/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@PathVariable TransactionType type) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(type));
    }
    
    @GetMapping("/transactions/status/{status}")
    public ResponseEntity<List<Transaction>> getTransactionsByStatus(@PathVariable TransactionStatus status) {
        return ResponseEntity.ok(transactionService.getTransactionsByStatus(status));
    }
    
    @GetMapping("/transactions/category/{category}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(transactionService.getTransactionsByCategory(category));
    }
    
    @GetMapping("/transactions/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(startDate, endDate));
    }
    
    @GetMapping("/transactions/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions() {
        return ResponseEntity.ok(transactionService.getRecentTransactions());
    }
    
    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody Transaction transaction) {
        try {
            Transaction updated = transactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/transactions/{id}/status")
    public ResponseEntity<Transaction> updateTransactionStatus(
            @PathVariable @NonNull Long id,
            @RequestParam TransactionStatus status) {
        try {
            Transaction updated = transactionService.updateTransactionStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable @NonNull Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ============ SCHOLARSHIP ENDPOINTS ============

    @GetMapping("/scholarships")
    public ResponseEntity<List<Scholarship>> getAllScholarships() {
        return ResponseEntity.ok(scholarshipService.getAllScholarships());
    }

    @GetMapping("/scholarships/{id}")
    public ResponseEntity<Scholarship> getScholarshipById(@PathVariable Long id) {
        return scholarshipService.getScholarshipById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/scholarships/student/{studentId}")
    public ResponseEntity<List<Scholarship>> getScholarshipsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(scholarshipService.getScholarshipsByStudentId(studentId));
    }

    @PostMapping("/scholarships")
    public ResponseEntity<Scholarship> createScholarship(@Valid @RequestBody Scholarship scholarship) {
        Scholarship created = scholarshipService.createScholarship(scholarship);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/scholarships/{id}")
    public ResponseEntity<Scholarship> updateScholarship(
            @PathVariable Long id,
            @Valid @RequestBody Scholarship scholarship) {
        try {
            Scholarship updated = scholarshipService.updateScholarship(id, scholarship);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/scholarships/{id}")
    public ResponseEntity<Void> deleteScholarship(@PathVariable Long id) {
        try {
            scholarshipService.deleteScholarship(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ============ TUITION FEE ENDPOINTS ============

    @GetMapping("/tuition-fees")
    public ResponseEntity<List<TuitionFee>> getAllTuitionFees() {
        return ResponseEntity.ok(tuitionFeeService.getAllTuitionFees());
    }

    @GetMapping("/tuition-fees/{id}")
    public ResponseEntity<TuitionFee> getTuitionFeeById(@PathVariable Long id) {
        return tuitionFeeService.getTuitionFeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tuition-fees/student/{studentId}")
    public ResponseEntity<List<TuitionFee>> getTuitionFeesByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(tuitionFeeService.getTuitionFeesByStudentId(studentId));
    }

    @PostMapping("/tuition-fees")
    public ResponseEntity<TuitionFee> createTuitionFee(@Valid @RequestBody TuitionFee tuitionFee) {
        try {
            TuitionFee created = tuitionFeeService.createTuitionFee(tuitionFee);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/tuition-fees/{id}")
    public ResponseEntity<TuitionFee> updateTuitionFee(
            @PathVariable Long id,
            @Valid @RequestBody TuitionFee tuitionFee) {
        try {
            TuitionFee updated = tuitionFeeService.updateTuitionFee(id, tuitionFee);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/tuition-fees/{id}")
    public ResponseEntity<Void> deleteTuitionFee(@PathVariable Long id) {
        try {
            tuitionFeeService.deleteTuitionFee(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
