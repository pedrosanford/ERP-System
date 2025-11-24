package com.edusync.finance.service;

import com.edusync.finance.client.StudentClient;
import com.edusync.finance.entity.Transaction;
import com.edusync.finance.entity.Transaction.TransactionStatus;
import com.edusync.finance.entity.Transaction.TransactionType;
import com.edusync.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final StudentClient studentClient;
    
    @Autowired
    public TransactionService(
            TransactionRepository transactionRepository,
            StudentClient studentClient) {
        this.transactionRepository = transactionRepository;
        this.studentClient = studentClient;
    }
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public Optional<Transaction> getTransactionById(@NonNull Long id) {
        return transactionRepository.findById(id);
    }
    
    public Optional<Transaction> getTransactionByTransactionId(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId);
    }
    
    public List<Transaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByType(type);
    }
    
    public List<Transaction> getTransactionsByStatus(TransactionStatus status) {
        return transactionRepository.findByStatus(status);
    }
    
    public List<Transaction> getTransactionsByCategory(String category) {
        return transactionRepository.findByCategory(category);
    }
    
    public List<Transaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Transaction> getTransactionsByTypeAndDateRange(
            TransactionType type, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByTypeAndDateBetween(type, startDate, endDate);
    }
    
    public List<Transaction> getTransactionsByStudentId(@NonNull Long studentId) {
        return transactionRepository.findByStudentId(studentId);
    }
    
    public List<Transaction> getTransactionsByStaffId(@NonNull Long staffId) {
        return transactionRepository.findByStaffId(staffId);
    }
    
    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findRecentTransactions();
    }
    
    public Transaction createTransaction(Transaction transaction) {
        // Validate transaction
        if (transaction.getTransactionId() != null && 
            transactionRepository.findByTransactionId(transaction.getTransactionId()).isPresent()) {
            throw new IllegalArgumentException("Transaction ID already exists: " + transaction.getTransactionId());
        }
        
        // Validate student exists if studentId is provided
        if (transaction.getStudentId() != null) {
            try {
                StudentClient.StudentResponse student = studentClient.getStudentById(transaction.getStudentId());
                if (student == null || !"ACTIVE".equals(student.getStatus())) {
                    throw new IllegalArgumentException(
                        "Student with ID " + transaction.getStudentId() + " not found or not active"
                    );
                }
            } catch (Exception e) {
                throw new IllegalArgumentException(
                    "Failed to validate student with ID " + transaction.getStudentId() + ": " + e.getMessage()
                );
            }
        }
        
        // Generate transaction ID if not provided
        if (transaction.getTransactionId() == null || transaction.getTransactionId().isEmpty()) {
            transaction.setTransactionId(generateTransactionId());
        }
        
        // Set default status if not provided
        if (transaction.getStatus() == null) {
            transaction.setStatus(TransactionStatus.PENDING);
        }
        
        return transactionRepository.save(transaction);
    }
    
    public Transaction updateTransaction(@NonNull Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        transaction.setType(transactionDetails.getType());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setSubCategory(transactionDetails.getSubCategory());
        transaction.setDate(transactionDetails.getDate());
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setReference(transactionDetails.getReference());
        transaction.setAccountId(transactionDetails.getAccountId());
        transaction.setStudentId(transactionDetails.getStudentId());
        transaction.setStaffId(transactionDetails.getStaffId());
        transaction.setStatus(transactionDetails.getStatus());
        transaction.setPaymentMethod(transactionDetails.getPaymentMethod());
        transaction.setNotes(transactionDetails.getNotes());
        
        return transactionRepository.save(transaction);
    }
    
    public Transaction updateTransactionStatus(@NonNull Long id, TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        transaction.setStatus(status);
        return transactionRepository.save(transaction);
    }
    
    public void deleteTransaction(@NonNull Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }
    
    // Statistics methods
    public long getTotalTransactionCount() {
        return transactionRepository.count();
    }
    
    public long getTransactionCountByType(TransactionType type) {
        return transactionRepository.countByType(type);
    }
    
    public BigDecimal getTotalAmountByType(TransactionType type) {
        BigDecimal total = transactionRepository.sumAmountByType(type);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalAmountByTypeAndDateRange(
            TransactionType type, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = transactionRepository.sumAmountByTypeAndDateBetween(type, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public List<Object[]> getCategoryBreakdownByType(TransactionType type) {
        return transactionRepository.sumAmountByTypeGroupByCategory(type);
    }
    
    // Helper methods
    private String generateTransactionId() {
        String prefix = "TXN";
        long timestamp = System.currentTimeMillis();
        return prefix + timestamp;
    }
}

