package com.edusync.finance.repository;

import com.edusync.finance.entity.TuitionFee;
import com.edusync.finance.entity.TuitionFee.TuitionFeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionFeeRepository extends JpaRepository<TuitionFee, Long> {

    List<TuitionFee> findByStudentId(String studentId);

    List<TuitionFee> findByAcademicYear(String academicYear);

    List<TuitionFee> findByStatus(TuitionFeeStatus status);

    Optional<TuitionFee> findByStudentIdAndAcademicYear(String studentId, String academicYear);

    @Query("SELECT t FROM TuitionFee t WHERE t.studentId = :studentId AND t.status = :status")
    List<TuitionFee> findByStudentIdAndStatus(@Param("studentId") String studentId, @Param("status") TuitionFeeStatus status);

    @Query("SELECT SUM(t.netAmount) FROM TuitionFee t WHERE t.studentId = :studentId AND t.status = 'ACTIVE'")
    BigDecimal sumActiveTuitionByStudentId(@Param("studentId") String studentId);

    @Query("SELECT COUNT(t) FROM TuitionFee t WHERE t.status = :status")
    long countByStatus(@Param("status") TuitionFeeStatus status);
}
