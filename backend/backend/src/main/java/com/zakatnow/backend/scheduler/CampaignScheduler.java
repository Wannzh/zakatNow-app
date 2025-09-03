package com.zakatnow.backend.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.enums.CampaignStatus;
import com.zakatnow.backend.repository.CampaignRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CampaignScheduler {
    private final CampaignRepository campaignRepository;

    @Scheduled(fixedRate = 3600000)
    public void updateCampaignStatuses() {
        LocalDate today = LocalDate.now();

        List<Campaign> campaigns = campaignRepository.findAll();

        for (Campaign campaign : campaigns) {
            if(campaign.getStatus() == CampaignStatus.ACTIVE) {
                if (campaign.getCollectedAmount().compareTo(campaign.getTargetAmount()) >= 0
                        && today.isBefore(campaign.getEndDate())) {
                    campaign.setStatus(CampaignStatus.COMPLETED);
                }
                else if (today.isAfter(campaign.getEndDate())
                        && campaign.getCollectedAmount().compareTo(campaign.getTargetAmount()) < 0) {
                    campaign.setStatus(CampaignStatus.CLOSED);
                }
            }
        }

        campaignRepository.saveAll(campaigns);
    }
}
