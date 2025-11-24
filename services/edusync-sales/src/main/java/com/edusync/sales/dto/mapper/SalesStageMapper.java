package com.edusync.sales.dto.mapper;

import com.edusync.sales.dto.SalesStageDTO;
import com.edusync.sales.entity.SalesStage;

public class SalesStageMapper {

    public static SalesStage toEntity(SalesStageDTO dto) {
        if (dto == null) {
            return null;
        }

        SalesStage stage = new SalesStage();
        stage.setStageId(dto.getStageId());
        stage.setTitle(dto.getTitle());
        stage.setColor(dto.getColor());
        stage.setSortOrder(dto.getSortOrder());
        stage.setIsActive(dto.getIsActive());

        return stage;
    }

    public static SalesStageDTO toDTO(SalesStage entity) {
        if (entity == null) {
            return null;
        }

        SalesStageDTO dto = new SalesStageDTO();
        dto.setStageId(entity.getStageId());
        dto.setTitle(entity.getTitle());
        dto.setColor(entity.getColor());
        dto.setSortOrder(entity.getSortOrder());
        dto.setIsActive(entity.getIsActive());

        return dto;
    }
}
