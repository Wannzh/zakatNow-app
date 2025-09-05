package com.zakatnow.backend.controllers.donation;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xendit.exception.XenditException;
import com.zakatnow.backend.dto.donation.DonationResponse;
import com.zakatnow.backend.dto.donation.HistoryDonationAllResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.PaymentMethod;
import com.zakatnow.backend.security.CustomeUserDetails;
import com.zakatnow.backend.services.campaign.CampaignService;
import com.zakatnow.backend.services.donation.DonationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/donations")
public class DonationController {
    private final DonationService donationService;
    private final CampaignService campaignService;

    @PostMapping("/create")
    public DonationResponse createDonation(
            @RequestParam String campaignId,
            @RequestParam Double amount,
            @RequestParam PaymentMethod paymentMethod) throws XenditException {

        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomeUserDetails userDetails)) {
            throw new RuntimeException("User tidak ditemukan");
        }
        User user = userDetails.getUser();

        Campaign campaign = campaignService.getById(campaignId);

        return donationService.createDonationInvoice(user, campaign, amount, paymentMethod);
    }

    @PostMapping("/webhook/xendit")
    public void handleWebhook(@org.springframework.web.bind.annotation.RequestBody Map<String, Object> payload) {
        donationService.handleWebhook(payload);
    }

    @GetMapping("/history")
    public List<DonationResponse> getDonationHistory() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomeUserDetails userDetails)) {
            throw new RuntimeException("User tidak ditemukan");
        }
        User user = userDetails.getUser();

        return donationService.getUserDonations(user.getId());
    }

    @GetMapping("/admin/history")
    public Page<HistoryDonationAllResponse> getAllDonationHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "donatedAt,desc") String sort) {

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return donationService.getAllDonations(pageable);
    }

    @GetMapping("/status/{externalId}")
    public ResponseEntity<DonationResponse> getDonationStatus(@PathVariable String externalId) {
        DonationResponse donation = donationService.getDonationByExternalId(externalId);
        if (donation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(donation);
    }
}