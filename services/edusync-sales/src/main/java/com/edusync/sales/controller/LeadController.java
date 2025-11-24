package com.edusync.sales.controller;

import com.edusync.sales.dto.CommunicationDTO;
import com.edusync.sales.dto.LeadDTO;
import com.edusync.sales.dto.TaskDTO;
import com.edusync.sales.dto.mapper.CommunicationMapper;
import com.edusync.sales.dto.mapper.LeadMapper;
import com.edusync.sales.dto.mapper.TaskMapper;
import com.edusync.sales.entity.Communication;
import com.edusync.sales.entity.Lead;
import com.edusync.sales.entity.Task;
import com.edusync.sales.service.CommunicationService;
import com.edusync.sales.service.LeadService;
import com.edusync.sales.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    private final LeadService leadService;
    private final TaskService taskService;
    private final CommunicationService communicationService;

    @Autowired
    public LeadController(LeadService leadService, TaskService taskService,
                         CommunicationService communicationService) {
        this.leadService = leadService;
        this.taskService = taskService;
        this.communicationService = communicationService;
    }

    // ============ LEAD CRUD ============

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String recruiter,
            @RequestParam(required = false) String search
    ) {
        List<Lead> leads;

        if (search != null && !search.isEmpty()) {
            leads = leadService.searchLeads(search);
        } else if (status != null) {
            leads = leadService.getLeadsByStatus(status);
        } else if (recruiter != null) {
            leads = leadService.getLeadsByRecruiter(recruiter);
        } else if (priority != null) {
            leads = leadService.getLeadsByPriority(Lead.Priority.valueOf(priority.toUpperCase()));
        } else {
            leads = leadService.getAllLeads();
        }

        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return leadService.getLeadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Lead> getLeadByEmail(@PathVariable String email) {
        return leadService.getLeadByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@Valid @RequestBody LeadDTO leadDTO) {
        Lead lead = LeadMapper.toEntity(leadDTO);
        Lead created = leadService.createLead(lead);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @Valid @RequestBody LeadDTO leadDTO) {
        Lead leadDetails = LeadMapper.toEntity(leadDTO);
        Lead updated = leadService.updateLead(id, leadDetails);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        String newStatus = request.get("status");
        Lead updated = leadService.updateLeadStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    // ============ TASKS (nested under leads) ============

    @GetMapping("/{leadId}/tasks")
    public ResponseEntity<List<Task>> getLeadTasks(@PathVariable Long leadId) {
        List<Task> tasks = taskService.getTasksByLeadId(leadId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{leadId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable Long leadId, @Valid @RequestBody TaskDTO taskDTO) {
        taskDTO.setLeadId(leadId);
        Task task = TaskMapper.toEntity(taskDTO);
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/tasks/{taskId}/complete")
    public ResponseEntity<Task> toggleTaskComplete(@PathVariable Long taskId) {
        Task updated = taskService.toggleTaskComplete(taskId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // ============ COMMUNICATIONS (nested under leads) ============

    @GetMapping("/{leadId}/communications")
    public ResponseEntity<List<Communication>> getLeadCommunications(@PathVariable Long leadId) {
        List<Communication> communications = communicationService.getCommunicationsByLeadId(leadId);
        return ResponseEntity.ok(communications);
    }

    @PostMapping("/{leadId}/communications")
    public ResponseEntity<Communication> createCommunication(
            @PathVariable Long leadId,
            @Valid @RequestBody CommunicationDTO commDTO
    ) {
        commDTO.setLeadId(leadId);
        Communication communication = CommunicationMapper.toEntity(commDTO);
        Communication created = communicationService.createCommunication(communication);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
