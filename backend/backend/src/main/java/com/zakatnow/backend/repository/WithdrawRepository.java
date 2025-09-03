package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.Withdraw;

public interface WithdrawRepository extends JpaRepository<Withdraw, String> {
    List<Withdraw> findByCampaignId(String campaignId);
}
