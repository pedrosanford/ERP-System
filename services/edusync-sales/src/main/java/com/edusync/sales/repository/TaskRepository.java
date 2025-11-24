package com.edusync.sales.repository;

import com.edusync.sales.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByLeadId(Long leadId);

    List<Task> findByLeadIdAndCompleted(Long leadId, Boolean completed);

    List<Task> findByCompleted(Boolean completed);

    List<Task> findByDueDateBefore(LocalDate date);

    List<Task> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT t FROM Task t WHERE t.leadId = :leadId ORDER BY t.dueDate ASC, t.createdAt ASC")
    List<Task> findByLeadIdOrderByDueDateAsc(@Param("leadId") Long leadId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.leadId = :leadId AND t.completed = false")
    long countPendingTasksByLeadId(@Param("leadId") Long leadId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.completed = false AND t.dueDate < :date")
    long countOverdueTasks(@Param("date") LocalDate date);
}
