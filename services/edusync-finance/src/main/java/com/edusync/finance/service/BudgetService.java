package com.edusync.finance.service;

import com.edusync.finance.entity.Budget;
import com.edusync.finance.entity.Budget.BudgetStatus;
import com.edusync.finance.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;

    @Autowired
    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<Budget> getBudgetsByStatus(BudgetStatus status) {
        return budgetRepository.findByStatus(status);
    }

    public List<Budget> getBudgetsByCategory(String category) {
        return budgetRepository.findByCategory(category);
    }

    public List<Budget> getActiveBudgetsForDate(LocalDate date) {
        return budgetRepository.findActiveBudgetsForDate(date);
    }

    public Budget createBudget(Budget budget) {
        if (budget.getStatus() == null) {
            budget.setStatus(BudgetStatus.ACTIVE);
        }
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Long id, Budget budgetDetails) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));

        budget.setName(budgetDetails.getName());
        budget.setCategory(budgetDetails.getCategory());
        budget.setAmount(budgetDetails.getAmount());
        budget.setSpent(budgetDetails.getSpent());
        budget.setPeriod(budgetDetails.getPeriod());
        budget.setStartDate(budgetDetails.getStartDate());
        budget.setEndDate(budgetDetails.getEndDate());
        budget.setDescription(budgetDetails.getDescription());
        budget.setStatus(budgetDetails.getStatus());
        budget.setAlertThreshold(budgetDetails.getAlertThreshold());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        budgetRepository.deleteById(id);
    }

    public long countActiveBudgets() {
        return budgetRepository.countActiveBudgets();
    }
}

