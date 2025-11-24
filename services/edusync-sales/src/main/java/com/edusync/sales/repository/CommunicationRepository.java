package com.edusync.sales.repository;

import com.edusync.sales.entity.Communication;
import com.edusync.sales.entity.Communication.CommunicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Long> {

    List<Communication> findByLeadId(Long leadId);

    List<Communication> findByLeadIdOrderByTimestampDesc(Long leadId);

    List<Communication> findByType(CommunicationType type);

    List<Communication> findByFollowUpRequired(Boolean followUpRequired);

    List<Communication> findByTimestampBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    @Query("SELECT c FROM Communication c WHERE c.leadId = :leadId ORDER BY c.timestamp DESC")
    List<Communication> findRecentCommunicationsByLeadId(@Param("leadId") Long leadId);

    @Query("SELECT c FROM Communication c WHERE c.followUpRequired = true ORDER BY c.timestamp DESC")
    List<Communication> findAllRequiringFollowUp();

    @Query("SELECT COUNT(c) FROM Communication c WHERE c.leadId = :leadId")
    long countByLeadId(@Param("leadId") Long leadId);
}
