package com.zakatnow.backend.enums;

public enum CampaignStatus {
    ACTIVE,
    COMPLETED,
    CLOSED,
    CANCELLED;

    public boolean isFinal() {
        return this == COMPLETED || this == CLOSED || this == CANCELLED;
    }
}
