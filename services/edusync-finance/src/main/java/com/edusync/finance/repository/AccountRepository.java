package com.edusync.finance.repository;

import com.edusync.finance.entity.Account;
import com.edusync.finance.entity.Account.AccountStatus;
import com.edusync.finance.entity.Account.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    Optional<Account> findByAccountNumber(String accountNumber);
    
    List<Account> findByStatus(AccountStatus status);
    
    List<Account> findByType(AccountType type);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.status = 'ACTIVE'")
    BigDecimal getTotalBalance();
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.status = 'ACTIVE'")
    long countActiveAccounts();
}

