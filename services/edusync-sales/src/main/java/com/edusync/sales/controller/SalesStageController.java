package com.edusync.sales.controller;

import com.edusync.sales.dto.SalesStageDTO;
import com.edusync.sales.dto.mapper.SalesStageMapper;
import com.edusync.sales.entity.SalesStage;
import com.edusync.sales.service.SalesStageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales/stages")
@CrossOrigin(origins = "*")
public class SalesStageController {

    private final SalesStageService stageService;

    @Autowired
    public SalesStageController(SalesStageService stageService) {
        this.stageService = stageService;
    }

    @GetMapping
    public ResponseEntity<List<SalesStage>> getAllStages(@RequestParam(defaultValue = "false") boolean includeInactive) {
        List<SalesStage> stages = includeInactive ? stageService.getAllStages() : stageService.getAllActiveStages();
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/{stageId}")
    public ResponseEntity<SalesStage> getStageByStageId(@PathVariable String stageId) {
        return stageService.getStageByStageId(stageId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SalesStage> createStage(@Valid @RequestBody SalesStageDTO stageDTO) {
        SalesStage stage = SalesStageMapper.toEntity(stageDTO);
        SalesStage created = stageService.createStage(stage);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesStage> updateStage(@PathVariable Long id, @Valid @RequestBody SalesStageDTO stageDTO) {
        SalesStage stageDetails = SalesStageMapper.toEntity(stageDTO);
        SalesStage updated = stageService.updateStage(id, stageDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
        return ResponseEntity.noContent().build();
    }
}
