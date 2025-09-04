package com.zakatnow.backend.event;

import org.springframework.context.ApplicationEvent;

public class DonationSuccessEvent extends ApplicationEvent {
    private final String donorEmail;
    private final String campaignName;
    private final double amount;

    public DonationSuccessEvent(Object source, String donorEmail, String campaignName, double amount) {
        super(source);
        this.donorEmail = donorEmail;
        this.campaignName = campaignName;
        this.amount = amount;
    }

    public String getDonorEmail() { return donorEmail; }
    public String getCampaignName() { return campaignName; }
    public double getAmount() { return amount; }
}
