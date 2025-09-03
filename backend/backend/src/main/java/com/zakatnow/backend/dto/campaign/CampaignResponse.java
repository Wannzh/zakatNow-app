package com.zakatnow.backend.dto.campaign;

import java.time.LocalDate;

import com.zakatnow.backend.enums.CampaignStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CampaignResponse {
    private String id;
    private String title;
    private String description;
    private Double targetAmount;
    private Double collectAmount;
    private String imageUrl;
    private CampaignStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdBy;
    private boolean cancelRequested;
    private String cancelReason;
}
