package com.edusync.sales.service;

import com.edusync.sales.entity.Communication;
import com.edusync.sales.exception.ResourceNotFoundException;
import com.edusync.sales.repository.CommunicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommunicationService {

    private final CommunicationRepository communicationRepository;

    @Autowired
    public CommunicationService(CommunicationRepository communicationRepository) {
        this.communicationRepository = communicationRepository;
    }

    public List<Communication> getCommunicationsByLeadId(Long leadId) {
        return communicationRepository.findByLeadIdOrderByTimestampDesc(leadId);
    }

    public Optional<Communication> getCommunicationById(Long id) {
        return communicationRepository.findById(id);
    }

    public Communication createCommunication(Communication communication) {
        return communicationRepository.save(communication);
    }

    public void deleteCommunication(Long id) {
        if (!communicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Communication", "id", id);
        }
        communicationRepository.deleteById(id);
    }

    public List<Communication> getAllRequiringFollowUp() {
        return communicationRepository.findAllRequiringFollowUp();
    }
}
