package com.edusync.finance.service;

import com.edusync.finance.entity.Transaction.TransactionType;
import com.edusync.finance.repository.AccountRepository;
import com.edusync.finance.repository.BudgetRepository;
import com.edusync.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@Service
public class FinanceStatsService {
    
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final BudgetRepository budgetRepository;
    
    @Autowired
    public FinanceStatsService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.budgetRepository = budgetRepository;
    }
    
    public Map<String, Object> getFinanceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get current month dates
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        
        // Get previous month dates
        YearMonth previousMonth = currentMonth.minusMonths(1);
        LocalDate startOfPreviousMonth = previousMonth.atDay(1);
        LocalDate endOfPreviousMonth = previousMonth.atEndOfMonth();
        
        // Calculate revenue
        BigDecimal totalRevenue = transactionRepository.sumAmountByType(TransactionType.INCOME);
        totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        
        BigDecimal monthlyRevenue = transactionRepository.sumAmountByTypeAndDateBetween(
            TransactionType.INCOME, startOfMonth, endOfMonth);
        monthlyRevenue = monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO;
        
        BigDecimal previousMonthRevenue = transactionRepository.sumAmountByTypeAndDateBetween(
            TransactionType.INCOME, startOfPreviousMonth, endOfPreviousMonth);
        previousMonthRevenue = previousMonthRevenue != null ? previousMonthRevenue : BigDecimal.ZERO;
        
        // Calculate revenue growth
        double revenueGrowth = calculateGrowth(previousMonthRevenue, monthlyRevenue);
        
        // Calculate expenses
        BigDecimal totalExpenses = transactionRepository.sumAmountByType(TransactionType.EXPENSE);
        totalExpenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
        
        BigDecimal monthlyExpenses = transactionRepository.sumAmountByTypeAndDateBetween(
            TransactionType.EXPENSE, startOfMonth, endOfMonth);
        monthlyExpenses = monthlyExpenses != null ? monthlyExpenses : BigDecimal.ZERO;
        
        BigDecimal previousMonthExpenses = transactionRepository.sumAmountByTypeAndDateBetween(
            TransactionType.EXPENSE, startOfPreviousMonth, endOfPreviousMonth);
        previousMonthExpenses = previousMonthExpenses != null ? previousMonthExpenses : BigDecimal.ZERO;
        
        // Calculate expense growth
        double expenseGrowth = calculateGrowth(previousMonthExpenses, monthlyExpenses);
        
        // Calculate profit
        BigDecimal netProfit = monthlyRevenue.subtract(monthlyExpenses);
        
        // Calculate profit margin
        double profitMargin = 0.0;
        if (monthlyRevenue.compareTo(BigDecimal.ZERO) > 0) {
            profitMargin = netProfit.multiply(BigDecimal.valueOf(100))
                                   .divide(monthlyRevenue, 2, RoundingMode.HALF_UP)
                                   .doubleValue();
        }
        
        // Get account balance
        BigDecimal totalBalance = accountRepository.getTotalBalance();
        totalBalance = totalBalance != null ? totalBalance : BigDecimal.ZERO;
        
        // Get counts
        long totalTransactions = transactionRepository.count();
        long totalAccounts = accountRepository.countActiveAccounts();
        long activeBudgets = budgetRepository.countActiveBudgets();
        
        // Build stats map
        stats.put("totalRevenue", totalRevenue);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("revenueGrowth", revenueGrowth);
        stats.put("totalExpenses", totalExpenses);
        stats.put("monthlyExpenses", monthlyExpenses);
        stats.put("expenseGrowth", expenseGrowth);
        stats.put("netProfit", netProfit);
        stats.put("profitMargin", profitMargin);
        stats.put("totalBalance", totalBalance);
        stats.put("totalTransactions", totalTransactions);
        stats.put("totalAccounts", totalAccounts);
        stats.put("activeBudgets", activeBudgets);
        
        return stats;
    }
    
    private double calculateGrowth(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        
        BigDecimal growth = current.subtract(previous)
                                  .multiply(BigDecimal.valueOf(100))
                                  .divide(previous, 2, RoundingMode.HALF_UP);
        return growth.doubleValue();
    }
}

