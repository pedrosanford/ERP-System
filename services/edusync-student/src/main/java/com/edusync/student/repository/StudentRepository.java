package com.edusync.student.repository;

import com.edusync.student.entity.Student;
import com.edusync.student.entity.Student.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByEmail(String email);
    
    List<Student> findByStatus(StudentStatus status);
    
    List<Student> findByProgram(String program);
    
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    boolean existsByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    long countByStatus(StudentStatus status);
}

