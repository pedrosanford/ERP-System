package com.edusync.sales.service;

import com.edusync.sales.entity.SalesStage;
import com.edusync.sales.exception.ResourceNotFoundException;
import com.edusync.sales.repository.SalesStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SalesStageService {

    private final SalesStageRepository stageRepository;

    @Autowired
    public SalesStageService(SalesStageRepository stageRepository) {
        this.stageRepository = stageRepository;
    }

    public List<SalesStage> getAllActiveStages() {
        return stageRepository.findAllActiveOrderBySortOrder();
    }

    public List<SalesStage> getAllStages() {
        return stageRepository.findAllOrderBySortOrder();
    }

    public Optional<SalesStage> getStageByStageId(String stageId) {
        return stageRepository.findByStageId(stageId);
    }

    public SalesStage createStage(SalesStage stage) {
        if (stageRepository.existsByStageId(stage.getStageId())) {
            throw new IllegalArgumentException("Stage with ID " + stage.getStageId() + " already exists");
        }

        // Prevent creating system default stages
        stage.setIsSystemDefault(false);

        return stageRepository.save(stage);
    }

    public SalesStage updateStage(Long id, SalesStage stageDetails) {
        SalesStage stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SalesStage", "id", id));

        // Only allow updating title and color for system defaults
        stage.setTitle(stageDetails.getTitle());
        stage.setColor(stageDetails.getColor());

        if (!stage.getIsSystemDefault()) {
            stage.setSortOrder(stageDetails.getSortOrder());
            stage.setIsActive(stageDetails.getIsActive());
        }

        return stageRepository.save(stage);
    }

    public void deleteStage(Long id) {
        SalesStage stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SalesStage", "id", id));

        if (stage.getIsSystemDefault()) {
            throw new IllegalArgumentException("Cannot delete system default stage: " + stage.getStageId());
        }

        stageRepository.deleteById(id);
    }
}
