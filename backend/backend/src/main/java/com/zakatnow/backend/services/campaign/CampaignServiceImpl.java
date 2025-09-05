package com.zakatnow.backend.services.campaign;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.zakatnow.backend.dto.campaign.CampaignRequest;
import com.zakatnow.backend.dto.campaign.CampaignResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.CampaignStatus;
import com.zakatnow.backend.repository.CampaignRepository;
import com.zakatnow.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    @Override
    public List<CampaignResponse> getAllCampaignsAsList() {
        // Mengambil semua kampanye dari repository, diurutkan berdasarkan judul
        return campaignRepository.findAll(Sort.by("title"))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CampaignResponse createCampaign(CampaignRequest request, String userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .collectedAmount(0.0)
                .imageUrl(request.getImageUrl())
                .status(CampaignStatus.ACTIVE)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdAt(LocalDateTime.now())
                .createdBy(creator)
                .build();
        Campaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    @Override
    public List<CampaignResponse> getCampaignsByStatus(CampaignStatus status) {
        return campaignRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CampaignResponse getCampaignById(String id) {
        return campaignRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Campaign not found!"));
    }

    @Override
    public CampaignResponse updateStatus(String id, CampaignStatus status) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found!"));

        if (campaign.getStatus().isFinal()) {
            throw new IllegalStateException(
                    "Campaign sudah tidak bisa diupdate karena status final: " + campaign.getStatus());
        }

        campaign.setStatus(status);
        Campaign updated = campaignRepository.save(campaign);
        return mapToResponse(updated);
    }

    // Untuk cancel admin ketika sudah ada request cancel
    @Transactional
    @Override
    public CampaignResponse cancelCampaignByAdmin(String campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (campaign.getStatus() == CampaignStatus.CANCELLED) {
            throw new RuntimeException("Campaign is already cancelled");
        }

        campaign.setStatus(CampaignStatus.CANCELLED);

        Campaign save = campaignRepository.save(campaign);
        return mapToResponse(save);
    }

    // Req untuk cancel dari campaigner
    @Transactional
    public CampaignResponse requestCancelByCampaigner(String campaignId, String reason, String campaignerId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // pastikan campaigner hanya bisa request cancel untuk campaign miliknya
        if (!campaign.getCreatedBy().getId().equals(campaignerId)) {
            throw new RuntimeException("You are not allowed to cancel this campaign");
        }

        // kalau sudah cancelled / completed tidak bisa request cancel
        if (campaign.getStatus() == CampaignStatus.CANCELLED ||
                campaign.getStatus() == CampaignStatus.COMPLETED ||
                campaign.getStatus() == CampaignStatus.CLOSED) {
            throw new RuntimeException("Cannot request cancellation for this campaign");
        }

        campaign.setCancelRequested(true);
        campaign.setCancelReason(reason);

        Campaign save = campaignRepository.save(campaign);
        return mapToResponse(save);
    }

    @Override
    public Campaign getById(String id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found!"));
    }

    private CampaignResponse mapToResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())
                .targetAmount(campaign.getTargetAmount())
                .collectAmount(campaign.getCollectedAmount())
                .imageUrl(campaign.getImageUrl())
                .status(campaign.getStatus())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .createdBy(campaign.getCreatedBy().getUsername())
                .cancelRequested(campaign.isCancelRequested())
                .cancelReason(campaign.getCancelReason())
                .build();
    }

}
