package com.edusync.student.service;

import com.edusync.student.entity.Student;
import com.edusync.student.entity.Student.StudentStatus;
import com.edusync.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {
    
    private final StudentRepository studentRepository;
    
    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentById(@NonNull Long id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    public List<Student> getStudentsByStatus(StudentStatus status) {
        return studentRepository.findByStatus(status);
    }
    
    public List<Student> getStudentsByProgram(String program) {
        return studentRepository.findByProgram(program);
    }
    
    public List<Student> searchStudents(String searchTerm) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(searchTerm, searchTerm);
    }
    
    public Student createStudent(Student student) {
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists: " + student.getStudentId());
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + student.getEmail());
        }
        return studentRepository.save(student);
    }
    
    public Student updateStudent(@NonNull Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + id));
        
        // Check for duplicate studentId if it's being changed
        if (!student.getStudentId().equals(studentDetails.getStudentId()) 
            && studentRepository.existsByStudentId(studentDetails.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists: " + studentDetails.getStudentId());
        }
        
        // Check for duplicate email if it's being changed
        if (!student.getEmail().equals(studentDetails.getEmail()) 
            && studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + studentDetails.getEmail());
        }
        
        student.setStudentId(studentDetails.getStudentId());
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setAddress(studentDetails.getAddress());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setEnrollmentDate(studentDetails.getEnrollmentDate());
        student.setProgram(studentDetails.getProgram());
        student.setCurrentSemester(studentDetails.getCurrentSemester());
        student.setGpa(studentDetails.getGpa());
        student.setAttendancePercentage(studentDetails.getAttendancePercentage());
        student.setStatus(studentDetails.getStatus());
        student.setFeeStatus(studentDetails.getFeeStatus());
        student.setLastPaymentDate(studentDetails.getLastPaymentDate());
        student.setGuardianName(studentDetails.getGuardianName());
        student.setGuardianPhone(studentDetails.getGuardianPhone());
        student.setGuardianEmail(studentDetails.getGuardianEmail());
        
        return studentRepository.save(student);
    }
    
    public void deleteStudent(@NonNull Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
    
    public long getTotalStudentsCount() {
        return studentRepository.count();
    }
    
    public long getActiveStudentsCount() {
        return studentRepository.countByStatus(StudentStatus.ACTIVE);
    }
}

