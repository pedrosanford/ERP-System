package com.edusync.finance.repository;

import com.edusync.finance.entity.Scholarship;
import com.edusync.finance.entity.Scholarship.ScholarshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    List<Scholarship> findByStudentId(String studentId);

    List<Scholarship> findByStatus(ScholarshipStatus status);

    List<Scholarship> findBySourceModule(String sourceModule);

    List<Scholarship> findByAcademicYear(String academicYear);

    @Query("SELECT s FROM Scholarship s WHERE s.studentId = :studentId AND s.status = :status")
    List<Scholarship> findByStudentIdAndStatus(@Param("studentId") String studentId, @Param("status") ScholarshipStatus status);

    @Query("SELECT SUM(s.amount) FROM Scholarship s WHERE s.studentId = :studentId AND s.status = 'ACTIVE'")
    BigDecimal sumActiveScholarshipsByStudentId(@Param("studentId") String studentId);

    @Query("SELECT COUNT(s) FROM Scholarship s WHERE s.status = :status")
    long countByStatus(@Param("status") ScholarshipStatus status);
}
