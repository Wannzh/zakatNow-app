package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.enums.CampaignStatus;

public interface CampaignRepository extends JpaRepository<Campaign, String> {
    List<Campaign> findByStatus(CampaignStatus status);
    List<Campaign> findByTitleContainingIgnoreCase(String keyword);
}
