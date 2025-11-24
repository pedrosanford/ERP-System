package com.edusync.sales.dto.mapper;

import com.edusync.sales.dto.TaskDTO;
import com.edusync.sales.entity.Task;

public class TaskMapper {

    public static Task toEntity(TaskDTO dto) {
        if (dto == null) {
            return null;
        }

        Task task = new Task();
        task.setLeadId(dto.getLeadId());
        task.setTitle(dto.getTitle());
        task.setCompleted(dto.getCompleted());
        task.setDueDate(dto.getDueDate());

        return task;
    }

    public static TaskDTO toDTO(Task entity) {
        if (entity == null) {
            return null;
        }

        TaskDTO dto = new TaskDTO();
        dto.setLeadId(entity.getLeadId());
        dto.setTitle(entity.getTitle());
        dto.setCompleted(entity.getCompleted());
        dto.setDueDate(entity.getDueDate());

        return dto;
    }
}
