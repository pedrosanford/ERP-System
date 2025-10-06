package com.edusync.finance.repository;

import com.edusync.finance.entity.Transaction;
import com.edusync.finance.entity.Transaction.TransactionStatus;
import com.edusync.finance.entity.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    List<Transaction> findByType(TransactionType type);
    
    List<Transaction> findByStatus(TransactionStatus status);
    
    List<Transaction> findByCategory(String category);
    
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByTypeAndDateBetween(TransactionType type, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByStudentId(Long studentId);
    
    List<Transaction> findByStaffId(Long staffId);
    
    List<Transaction> findByAccountId(Long accountId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.type = :type")
    long countByType(@Param("type") TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type AND t.status = 'COMPLETED'")
    BigDecimal sumAmountByType(@Param("type") TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type AND t.date BETWEEN :startDate AND :endDate AND t.status = 'COMPLETED'")
    BigDecimal sumAmountByTypeAndDateBetween(
        @Param("type") TransactionType type,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.type = :type AND t.status = 'COMPLETED' GROUP BY t.category")
    List<Object[]> sumAmountByTypeGroupByCategory(@Param("type") TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = 'COMPLETED' ORDER BY t.date DESC")
    List<Transaction> findRecentTransactions();
}

