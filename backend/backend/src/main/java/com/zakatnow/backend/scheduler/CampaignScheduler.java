package com.zakatnow.backend.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.enums.CampaignStatus;
import com.zakatnow.backend.event.CampaignDeadlineEvent;
import com.zakatnow.backend.repository.CampaignRepository;
import com.zakatnow.backend.repository.DonationRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CampaignScheduler {
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(fixedRate = 3600000)
    public void updateCampaignStatuses() {
        LocalDate today = LocalDate.now();

        List<Campaign> campaigns = campaignRepository.findAll();

        for (Campaign campaign : campaigns) {
            if (campaign.getStatus() == CampaignStatus.ACTIVE) {
                if (campaign.getCollectedAmount().compareTo(campaign.getTargetAmount()) >= 0
                        && today.isBefore(campaign.getEndDate())) {
                    campaign.setStatus(CampaignStatus.COMPLETED);
                } else if (today.isAfter(campaign.getEndDate())
                        && campaign.getCollectedAmount().compareTo(campaign.getTargetAmount()) < 0) {
                    campaign.setStatus(CampaignStatus.CLOSED);
                }
            }
        }

        campaignRepository.saveAll(campaigns);
    }

    @Scheduled(cron = "0 0 22 * * *") // tiap jam 22:00
    public void remindCampaignDeadline() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Campaign> nearDeadline = campaignRepository.findCampaignsExpiringTomorrow(tomorrow);

        for (Campaign campaign : nearDeadline) {
            donationRepository.findDistinctUsersByCampaign(campaign.getId())
                    .forEach(donor -> {
                        eventPublisher.publishEvent(
                                new CampaignDeadlineEvent(
                                        this,
                                        donor.getEmail(),
                                        campaign.getTitle(),
                                        campaign.getEndDate().toString()));
                    });
        }
    }

}
