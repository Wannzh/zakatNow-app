package com.zakatnow.backend.services.notification;

public interface EmailNotificationService {
    void sendRegistrationSuccess(String to, String name);
    void sendRoleUpgradeResult(String to, String name, boolean approved);
    void sendDonationNotification(String to, String campaignName, double amount);
    void sendCampaignDeadlineReminder(String to, String campaignName, String deadlineDate);
}
