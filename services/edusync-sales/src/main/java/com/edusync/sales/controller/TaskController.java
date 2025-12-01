package com.edusync.sales.controller;

import com.edusync.sales.entity.Task;
import com.edusync.sales.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by lead ID
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<Task>> getTasksByLeadId(@PathVariable Long leadId) {
        List<Task> tasks = taskRepository.findByLeadId(leadId);
        return ResponseEntity.ok(tasks);
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task saved = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update task (e.g., mark as completed)
    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskUpdates) {
        return taskRepository.findById(id)
            .map(task -> {
                if (taskUpdates.getCompleted() != null) {
                    task.setCompleted(taskUpdates.getCompleted());
                }
                if (taskUpdates.getTitle() != null) {
                    task.setTitle(taskUpdates.getTitle());
                }
                if (taskUpdates.getDueDate() != null) {
                    task.setDueDate(taskUpdates.getDueDate());
                }
                Task updated = taskRepository.save(task);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
