package com.edusync.hr.repository;

import com.edusync.hr.entity.Attendance;
import com.edusync.hr.entity.Attendance.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByStaffId(Long staffId);
    
    List<Attendance> findByStaffIdAndDateBetween(Long staffId, LocalDate startDate, LocalDate endDate);
    
    Optional<Attendance> findByStaffIdAndDate(Long staffId, LocalDate date);
    
    List<Attendance> findByDate(LocalDate date);
    
    List<Attendance> findByStatus(AttendanceStatus status);
    
    @Query("SELECT a FROM Attendance a WHERE a.staffId = ?1 AND a.date >= ?2 AND a.date <= ?3")
    List<Attendance> findAttendanceByStaffAndDateRange(Long staffId, LocalDate startDate, LocalDate endDate);
}

