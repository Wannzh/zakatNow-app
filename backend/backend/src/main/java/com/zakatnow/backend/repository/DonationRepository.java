package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zakatnow.backend.entity.Donation;
import com.zakatnow.backend.entity.User;

public interface DonationRepository extends JpaRepository<Donation, String> {
    Donation findByExternalId(String externalId);

    List<Donation> findByUserId(String userId);

    // Tambahan untuk filter laporan berdasarkan campaign
    List<Donation> findByCampaignId(String campaignId);

    @Query("select distinct d.user from Donation d where d.campaign.id = :campaignId")
    List<User> findDistinctUsersByCampaign(@Param("campaignId") String campaignId);
}
