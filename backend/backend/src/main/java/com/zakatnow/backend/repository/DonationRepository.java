package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.Donation;

public interface DonationRepository extends JpaRepository<Donation, String>{
    Donation findByExternalId(String externalId);
    List<Donation> findByUserId(String userId);

    // Tambahan untuk filter laporan berdasarkan campaign
    List<Donation> findByCampaignId(String campaignId);
}
