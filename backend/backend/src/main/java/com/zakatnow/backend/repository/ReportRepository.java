package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.Report;

public interface ReportRepository extends JpaRepository<Report, String> {
    List<Report> findByCampaignId(String campaignId);
}
