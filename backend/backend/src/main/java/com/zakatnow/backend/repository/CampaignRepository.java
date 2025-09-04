package com.zakatnow.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.enums.CampaignStatus;

public interface CampaignRepository extends JpaRepository<Campaign, String> {
    List<Campaign> findByStatus(CampaignStatus status);

    List<Campaign> findByTitleContainingIgnoreCase(String keyword);

    @Query("""
            SELECT c FROM Campaign c
            WHERE c.status = com.zakatnow.backend.enums.CampaignStatus.ACTIVE
              AND c.endDate = :tomorrow
            """)
    List<Campaign> findCampaignsExpiringTomorrow(@Param("tomorrow") LocalDate tomorrow);
}
