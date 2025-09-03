package com.zakatnow.backend.controllers.campaign;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zakatnow.backend.dto.campaign.CampaignRequest;
import com.zakatnow.backend.dto.campaign.CampaignResponse;
import com.zakatnow.backend.enums.CampaignStatus;
import com.zakatnow.backend.security.CustomeUserDetails;
import com.zakatnow.backend.services.campaign.CampaignService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @PostMapping("/create")
    public ResponseEntity<CampaignResponse> create(@Valid @RequestBody CampaignRequest request,
                                   @RequestParam String userId) {
        CampaignResponse response = campaignService.createCampaign(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping()
    public ResponseEntity<List<CampaignResponse>> getCampaigns(@RequestParam(required = false) CampaignStatus status) {
        List<CampaignResponse> campaigns;

        if (status != null) {
        // kalau ada status di query param → filter sesuai status
        campaigns = campaignService.getCampaignsByStatus(status);
    } else {
        // default → hanya ACTIVE
        campaigns = campaignService.getCampaignsByStatus(CampaignStatus.ACTIVE);
    }

        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getById(@PathVariable String id) {
        CampaignResponse response = campaignService.getCampaignById(id);
        return ResponseEntity.ok(response); 
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CampaignResponse> updateStatus(@PathVariable String id,
                                                         @RequestParam CampaignStatus status) {
        CampaignResponse response = campaignService.updateStatus(id, status);
        return ResponseEntity.ok(response); 
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<String> cancelCampaign(@PathVariable String id) {
        campaignService.cancelCampaignByAdmin(id);
        return ResponseEntity.ok("Campaign with ID " + id + " has been cancelled by Admin");
    }

    @PatchMapping("/{id}/request-cancel")
    public ResponseEntity<String> requestCancel(
            @PathVariable String id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal CustomeUserDetails user
    ) {
        campaignService.requestCancelByCampaigner(id, reason, user.getId());
        return ResponseEntity.ok("Cancel request submitted for campaign ID " + id);
    }
}
