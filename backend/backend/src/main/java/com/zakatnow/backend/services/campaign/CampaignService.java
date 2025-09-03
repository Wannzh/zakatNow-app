package com.zakatnow.backend.services.campaign;

import java.util.List;

import com.zakatnow.backend.dto.campaign.CampaignRequest;
import com.zakatnow.backend.dto.campaign.CampaignResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.enums.CampaignStatus;

public interface CampaignService {
    CampaignResponse createCampaign(CampaignRequest request, String userId);
    List<CampaignResponse> getCampaignsByStatus(CampaignStatus status);
    CampaignResponse getCampaignById(String id);
    CampaignResponse updateStatus(String id, CampaignStatus status);
    CampaignResponse cancelCampaignByAdmin(String campaignId);
    CampaignResponse requestCancelByCampaigner(String campaignId, String reason, String campaignerId);
    Campaign getById(String id);

}
