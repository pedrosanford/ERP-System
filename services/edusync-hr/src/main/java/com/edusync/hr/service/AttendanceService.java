package com.edusync.hr.service;

import com.edusync.hr.entity.Attendance;
import com.edusync.hr.entity.Attendance.AttendanceStatus;
import com.edusync.hr.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }
    
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }
    
    public List<Attendance> getAttendanceByStaff(Long staffId) {
        return attendanceRepository.findByStaffId(staffId);
    }
    
    public Optional<Attendance> getAttendanceByStaffAndDate(Long staffId, LocalDate date) {
        return attendanceRepository.findByStaffIdAndDate(staffId, date);
    }
    
    public List<Attendance> getAttendanceByDateRange(Long staffId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStaffIdAndDateBetween(staffId, startDate, endDate);
    }
    
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
    
    public List<Attendance> getAttendanceByStatus(AttendanceStatus status) {
        return attendanceRepository.findByStatus(status);
    }
    
    public Attendance createAttendance(Attendance attendance) {
        // Check if attendance already exists for this staff on this date
        Optional<Attendance> existing = attendanceRepository.findByStaffIdAndDate(
            attendance.getStaffId(), 
            attendance.getDate()
        );
        
        if (existing.isPresent()) {
            throw new IllegalArgumentException(
                "Attendance already exists for staff " + attendance.getStaffId() + 
                " on date " + attendance.getDate()
            );
        }
        
        return attendanceRepository.save(attendance);
    }
    
    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Attendance not found with id: " + id));
        
        attendance.setCheckInTime(attendanceDetails.getCheckInTime());
        attendance.setCheckOutTime(attendanceDetails.getCheckOutTime());
        attendance.setStatus(attendanceDetails.getStatus());
        attendance.setHoursWorked(attendanceDetails.getHoursWorked());
        attendance.setNotes(attendanceDetails.getNotes());
        
        return attendanceRepository.save(attendance);
    }
    
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}

