package com.edusync.sales.service;

import com.edusync.sales.entity.Task;
import com.edusync.sales.exception.ResourceNotFoundException;
import com.edusync.sales.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasksByLeadId(Long leadId) {
        return taskRepository.findByLeadIdOrderByDueDateAsc(leadId);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setTitle(taskDetails.getTitle());
        task.setCompleted(taskDetails.getCompleted());
        task.setDueDate(taskDetails.getDueDate());

        return taskRepository.save(task);
    }

    public Task toggleTaskComplete(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setCompleted(!task.getCompleted());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }

    public long countOverdueTasks() {
        return taskRepository.countOverdueTasks(LocalDate.now());
    }
}
