package com.edusync.student.controller;

import com.edusync.student.entity.Student;
import com.edusync.student.entity.Student.StudentStatus;
import com.edusync.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStudentStats() {
        long totalStudents = studentService.getTotalStudentsCount();
        long activeStudents = studentService.getActiveStudentsCount();
        
        return Map.of(
            "totalStudents", totalStudents,
            "activeStudents", activeStudents,
            "newEnrollments", 12,
            "graduatedStudents", 156,
            "averageGrade", 85.5
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-student");
    }

    // Get all students
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Get student by ID
    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Get student by student ID
    @GetMapping("/students/by-student-id/{studentId}")
    public ResponseEntity<Student> getStudentByStudentId(@PathVariable String studentId) {
        return studentService.getStudentByStudentId(studentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Get students by status
    @GetMapping("/students/status/{status}")
    public ResponseEntity<List<Student>> getStudentsByStatus(@PathVariable StudentStatus status) {
        List<Student> students = studentService.getStudentsByStatus(status);
        return ResponseEntity.ok(students);
    }

    // Get students by program
    @GetMapping("/students/program/{program}")
    public ResponseEntity<List<Student>> getStudentsByProgram(@PathVariable String program) {
        List<Student> students = studentService.getStudentsByProgram(program);
        return ResponseEntity.ok(students);
    }

    // Search students
    @GetMapping("/students/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String query) {
        List<Student> students = studentService.searchStudents(query);
        return ResponseEntity.ok(students);
    }

    // Create student
    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        try {
            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update student
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(
        @PathVariable Long id,
        @Valid @RequestBody Student student
    ) {
        try {
            Student updatedStudent = studentService.updateStudent(id, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete student
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
