package com.edusync.sales.dto.mapper;

import com.edusync.sales.dto.CommunicationDTO;
import com.edusync.sales.entity.Communication;

public class CommunicationMapper {

    public static Communication toEntity(CommunicationDTO dto) {
        if (dto == null) {
            return null;
        }

        Communication communication = new Communication();
        communication.setLeadId(dto.getLeadId());
        communication.setType(dto.getType());
        communication.setSummary(dto.getSummary());
        communication.setTimestamp(dto.getTimestamp());
        communication.setFollowUpRequired(dto.getFollowUpRequired());
        communication.setCreatedBy(dto.getCreatedBy());

        return communication;
    }

    public static CommunicationDTO toDTO(Communication entity) {
        if (entity == null) {
            return null;
        }

        CommunicationDTO dto = new CommunicationDTO();
        dto.setLeadId(entity.getLeadId());
        dto.setType(entity.getType());
        dto.setSummary(entity.getSummary());
        dto.setTimestamp(entity.getTimestamp());
        dto.setFollowUpRequired(entity.getFollowUpRequired());
        dto.setCreatedBy(entity.getCreatedBy());

        return dto;
    }
}
