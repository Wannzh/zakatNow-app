package com.zakatnow.backend.event;

import org.springframework.context.ApplicationEvent;

public class CampaignDeadlineEvent extends ApplicationEvent {
    private final String ownerEmail;
    private final String campaignName;
    private final String deadlineDate; 

    public CampaignDeadlineEvent(Object source, String ownerEmail, String campaignName, String deadlineDate) {
        super(source);
        this.ownerEmail = ownerEmail;
        this.campaignName = campaignName;
        this.deadlineDate = deadlineDate;
    }

    public String getOwnerEmail() { return ownerEmail; }
    public String getCampaignName() { return campaignName; }
    public String getDeadlineDate() { return deadlineDate; }
}