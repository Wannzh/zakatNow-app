package com.zakatnow.backend.services.withdraw;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.zakatnow.backend.dto.withdraw.WithdrawRequest;
import com.zakatnow.backend.dto.withdraw.WithdrawResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.Donation;
import com.zakatnow.backend.entity.Withdraw;
import com.zakatnow.backend.enums.WithdrawStatus;
import com.zakatnow.backend.repository.CampaignRepository;
import com.zakatnow.backend.repository.WithdrawRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WithdrawServiceImpl implements WithdrawService {
    private final WithdrawRepository withdrawRepository;
    private final CampaignRepository campaignRepository;

    @Override
    public WithdrawResponse requestWithdraw(WithdrawRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // Hitung saldo tersedia
        double totalDonation = campaign.getDonations().stream()
                .mapToDouble(Donation::getAmount)
                .sum();

        double totalWithdrawn = withdrawRepository.findByCampaignId(campaign.getId()).stream()
                .filter(w -> w.getStatus() == WithdrawStatus.APPROVED)
                .mapToDouble(Withdraw::getAmount)
                .sum();

        double availableBalance = totalDonation - totalWithdrawn;

        if (request.getAmount() > availableBalance) {
            throw new RuntimeException("Withdraw amount exceeds available balance");
        }

        Withdraw withdraw = Withdraw.builder()
                .id(UUID.randomUUID().toString())
                .campaign(campaign)
                .amount(request.getAmount())
                .status(WithdrawStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .note(request.getNote())
                .build();

        withdrawRepository.save(withdraw);

        return mapToResponse(withdraw);
    }

    @Override
    public WithdrawResponse approveWithdraw(String withdrawId, String note) {
        Withdraw withdraw = withdrawRepository.findById(withdrawId)
                .orElseThrow(() -> new RuntimeException("Withdraw not found"));

        withdraw.setStatus(WithdrawStatus.APPROVED);
        withdraw.setApprovedAt(LocalDateTime.now());
        withdraw.setNote(note);

        withdrawRepository.save(withdraw);
        return mapToResponse(withdraw);
    }

    @Override
    public WithdrawResponse rejectWithdraw(String withdrawId, String reason) {
        Withdraw withdraw = withdrawRepository.findById(withdrawId)
                .orElseThrow(() -> new RuntimeException("Withdraw not found"));

        withdraw.setStatus(WithdrawStatus.REJECTED);
        withdraw.setRejectedReason(reason);

        withdrawRepository.save(withdraw);
        return mapToResponse(withdraw);
    }

    @Override
    public List<WithdrawResponse> getWithdrawsByCampaign(String campaignId) {
        return withdrawRepository.findByCampaignId(campaignId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<WithdrawResponse> getAllWithdraws() {
        return withdrawRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private WithdrawResponse mapToResponse(Withdraw withdraw) {
        return WithdrawResponse.builder()
                .id(withdraw.getId())
                .campaignId(withdraw.getCampaign().getId())
                .campaignTitle(withdraw.getCampaign().getTitle())
                .amount(withdraw.getAmount())
                .status(withdraw.getStatus())
                .requestedAt(withdraw.getRequestedAt())
                .approvedAt(withdraw.getApprovedAt())
                .note(withdraw.getNote())
                .rejectedReason(withdraw.getRejectedReason())
                .build();
    }
}
