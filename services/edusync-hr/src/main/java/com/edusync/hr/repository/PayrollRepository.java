package com.edusync.hr.repository;

import com.edusync.hr.entity.Payroll;
import com.edusync.hr.entity.Payroll.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    List<Payroll> findByStaffId(Long staffId);
    
    List<Payroll> findByStatus(PayrollStatus status);
    
    List<Payroll> findByPayPeriodStartAndPayPeriodEnd(LocalDate startDate, LocalDate endDate);
    
    Optional<Payroll> findByStaffIdAndPayPeriodStartAndPayPeriodEnd(Long staffId, LocalDate startDate, LocalDate endDate);
    
    List<Payroll> findByStaffIdAndStatus(Long staffId, PayrollStatus status);
    
    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.payPeriodStart >= ?1 AND p.payPeriodEnd <= ?2 AND p.status = 'PAID'")
    BigDecimal calculateTotalPayrollForPeriod(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.status = 'PENDING'")
    Long countPendingPayrolls();
}

