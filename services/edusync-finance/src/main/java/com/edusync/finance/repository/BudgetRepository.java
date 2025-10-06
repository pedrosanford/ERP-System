package com.edusync.finance.repository;

import com.edusync.finance.entity.Budget;
import com.edusync.finance.entity.Budget.BudgetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByStatus(BudgetStatus status);
    
    List<Budget> findByCategory(String category);
    
    @Query("SELECT b FROM Budget b WHERE b.status = 'ACTIVE' AND b.startDate <= :date AND b.endDate >= :date")
    List<Budget> findActiveBudgetsForDate(LocalDate date);
    
    @Query("SELECT COUNT(b) FROM Budget b WHERE b.status = 'ACTIVE'")
    long countActiveBudgets();
}

