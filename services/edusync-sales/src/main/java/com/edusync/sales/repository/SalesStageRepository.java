package com.edusync.sales.repository;

import com.edusync.sales.entity.SalesStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesStageRepository extends JpaRepository<SalesStage, Long> {

    Optional<SalesStage> findByStageId(String stageId);

    List<SalesStage> findByIsActive(Boolean isActive);

    @Query("SELECT s FROM SalesStage s WHERE s.isActive = true ORDER BY s.sortOrder ASC")
    List<SalesStage> findAllActiveOrderBySortOrder();

    @Query("SELECT s FROM SalesStage s ORDER BY s.sortOrder ASC")
    List<SalesStage> findAllOrderBySortOrder();

    boolean existsByStageId(String stageId);
}
