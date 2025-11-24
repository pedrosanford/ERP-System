package com.edusync.sales.controller;

import com.edusync.sales.entity.Communication;
import com.edusync.sales.repository.CommunicationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/communications")
@CrossOrigin(origins = "*")
public class CommunicationController {

    @Autowired
    private CommunicationRepository communicationRepository;

    // Get all communications
    @GetMapping
    public ResponseEntity<List<Communication>> getAllCommunications() {
        List<Communication> communications = communicationRepository.findAll();
        return ResponseEntity.ok(communications);
    }

    // Get communications by lead ID
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<Communication>> getCommunicationsByLeadId(@PathVariable Long leadId) {
        List<Communication> communications = communicationRepository.findByLeadIdOrderByTimestampDesc(leadId);
        return ResponseEntity.ok(communications);
    }

    // Create a new communication
    @PostMapping
    public ResponseEntity<Communication> createCommunication(@Valid @RequestBody Communication communication) {
        if (communication.getTimestamp() == null) {
            communication.setTimestamp(LocalDateTime.now());
        }
        Communication saved = communicationRepository.save(communication);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Delete a communication
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunication(@PathVariable Long id) {
        if (!communicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        communicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
