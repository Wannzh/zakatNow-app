package com.zakatnow.backend.listener;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.zakatnow.backend.event.CampaignDeadlineEvent;
import com.zakatnow.backend.event.DonationSuccessEvent;
import com.zakatnow.backend.event.UserRegisteredEvent;
import com.zakatnow.backend.event.UserUpgradeRoleEvent;
import com.zakatnow.backend.services.notification.EmailNotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailEventListener {
    private final EmailNotificationService emailService;

    @Async
    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        emailService.sendRegistrationSuccess(event.getEmail(), event.getFullName());
    }

    @Async
    @EventListener
    public void handleDonationSuccess(DonationSuccessEvent event) {
        emailService.sendDonationNotification(
                event.getDonorEmail(),
                event.getCampaignName(),
                event.getAmount());
    }

    @Async
    @EventListener
    public void handleCampaignDeadline(CampaignDeadlineEvent event) {
        emailService.sendCampaignDeadlineReminder(
                event.getOwnerEmail(),
                event.getCampaignName(),
                event.getDeadlineDate());
    }

    @Async
    @EventListener
    public void handleUserUpgradeApprove(UserUpgradeRoleEvent event) {
        emailService.sendRoleUpgradeResult(
                event.getEmail(),
                event.getFullName(),
                true);
    }

    @Async
    @EventListener
    public void handleUserUpgradeReject(UserUpgradeRoleEvent event) {
        emailService.sendRoleUpgradeResult(
                event.getEmail(),
                event.getFullName(),
                false);
    }
}
