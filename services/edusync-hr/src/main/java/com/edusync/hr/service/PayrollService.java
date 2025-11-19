package com.edusync.hr.service;

import com.edusync.hr.entity.Payroll;
import com.edusync.hr.entity.Payroll.PayrollStatus;
import com.edusync.hr.repository.PayrollRepository;
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
public class PayrollService {
    
    private final PayrollRepository payrollRepository;
    
    @Autowired
    public PayrollService(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }
    
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }
    
    public Optional<Payroll> getPayrollById(@NonNull Long id) {
        return payrollRepository.findById(id);
    }
    
    public List<Payroll> getPayrollsByStaff(@NonNull Long staffId) {
        return payrollRepository.findByStaffId(staffId);
    }
    
    public List<Payroll> getPayrollsByStatus(PayrollStatus status) {
        return payrollRepository.findByStatus(status);
    }
    
    public List<Payroll> getPendingPayrolls() {
        return payrollRepository.findByStatus(PayrollStatus.PENDING);
    }
    
    public Long countPendingPayrolls() {
        return payrollRepository.countPendingPayrolls();
    }
    
    public List<Payroll> getPayrollsByPeriod(LocalDate startDate, LocalDate endDate) {
        return payrollRepository.findByPayPeriodStartAndPayPeriodEnd(startDate, endDate);
    }
    
    public BigDecimal calculateTotalPayroll(LocalDate startDate, LocalDate endDate) {
        return payrollRepository.calculateTotalPayrollForPeriod(startDate, endDate);
    }
    
    public Payroll createPayroll(Payroll payroll) {
        // Check if payroll already exists for this staff and period
        Optional<Payroll> existing = payrollRepository.findByStaffIdAndPayPeriodStartAndPayPeriodEnd(
            payroll.getStaffId(),
            payroll.getPayPeriodStart(),
            payroll.getPayPeriodEnd()
        );
        
        if (existing.isPresent()) {
            throw new IllegalArgumentException(
                "Payroll already exists for staff " + payroll.getStaffId() + 
                " for period " + payroll.getPayPeriodStart() + " to " + payroll.getPayPeriodEnd()
            );
        }
        
        // Calculate net salary if not provided
        if (payroll.getNetSalary() == null) {
            BigDecimal netSalary = payroll.getBaseSalary()
                .add(payroll.getBonuses() != null ? payroll.getBonuses() : BigDecimal.ZERO)
                .subtract(payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO)
                .subtract(payroll.getTax() != null ? payroll.getTax() : BigDecimal.ZERO);
            payroll.setNetSalary(netSalary);
        }
        
        return payrollRepository.save(payroll);
    }
    
    public Payroll updatePayroll(@NonNull Long id, Payroll payrollDetails) {
        Payroll payroll = payrollRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Payroll not found with id: " + id));
        
        payroll.setBaseSalary(payrollDetails.getBaseSalary());
        payroll.setBonuses(payrollDetails.getBonuses());
        payroll.setDeductions(payrollDetails.getDeductions());
        payroll.setTax(payrollDetails.getTax());
        
        // Recalculate net salary
        BigDecimal netSalary = payrollDetails.getBaseSalary()
            .add(payrollDetails.getBonuses() != null ? payrollDetails.getBonuses() : BigDecimal.ZERO)
            .subtract(payrollDetails.getDeductions() != null ? payrollDetails.getDeductions() : BigDecimal.ZERO)
            .subtract(payrollDetails.getTax() != null ? payrollDetails.getTax() : BigDecimal.ZERO);
        payroll.setNetSalary(netSalary);
        
        payroll.setPaymentDate(payrollDetails.getPaymentDate());
        payroll.setPaymentMethod(payrollDetails.getPaymentMethod());
        payroll.setStatus(payrollDetails.getStatus());
        
        return payrollRepository.save(payroll);
    }
    
    public Payroll processPayroll(@NonNull Long id) {
        Payroll payroll = payrollRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Payroll not found with id: " + id));
        
        payroll.setStatus(PayrollStatus.PROCESSED);
        return payrollRepository.save(payroll);
    }
    
    public Payroll markPayrollAsPaid(@NonNull Long id, LocalDate paymentDate) {
        Payroll payroll = payrollRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Payroll not found with id: " + id));
        
        payroll.setStatus(PayrollStatus.PAID);
        payroll.setPaymentDate(paymentDate);
        
        return payrollRepository.save(payroll);
    }
    
    public void deletePayroll(@NonNull Long id) {
        payrollRepository.deleteById(id);
    }
}

