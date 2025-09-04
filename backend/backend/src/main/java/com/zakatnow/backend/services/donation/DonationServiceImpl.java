package com.zakatnow.backend.services.donation;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.xendit.exception.XenditException;
import com.xendit.model.Invoice;
import com.zakatnow.backend.enums.PaymentMethod;
import com.zakatnow.backend.event.DonationSuccessEvent;
import com.zakatnow.backend.dto.donation.DonationResponse;
import com.zakatnow.backend.dto.donation.HistoryDonationAllResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.Donation;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.DonationStatus;
import com.zakatnow.backend.repository.CampaignRepository;
import com.zakatnow.backend.repository.DonationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {
    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final ApplicationEventPublisher publisher;

    @Override
    public DonationResponse createDonationInvoice(User user, Campaign campaign, Double amount, PaymentMethod method)
            throws XenditException {

        // Simpan donasi
        Donation donation = Donation.builder()
                .user(user)
                .campaign(campaign)
                .amount(amount)
                .status(DonationStatus.PENDING)
                .paymentMethod(method)
                .externalId("donation-" + System.currentTimeMillis())
                .donatedAt(LocalDateTime.now())
                .build();
        donationRepository.save(donation);

        Map<String, Object> invoiceData = new HashMap<>();
        invoiceData.put("external_id", donation.getExternalId());
        invoiceData.put("amount", amount);

        switch (method) {
            case BANK_TRANSFER, EWALLET -> {
                invoiceData.put("payment_method", method.name());
                invoiceData.put("callback_url", "https://8e7aa9a940b2.ngrok-free.app/api/donations/webhook/xendit");

            }
            case QRIS -> {
                invoiceData.put("payment_method", "QRIS");
                invoiceData.put("type", "DYNAMIC"); // optional, untuk dynamic QR
                invoiceData.put("callback_url", "https://8e7aa9a940b2.ngrok-free.app/api/donations/webhook/xendit");
            }
        }

        // Buat invoice Xendit
        Invoice invoice = Invoice.create(invoiceData);
        donation.setXenditInvoiceId(invoice.getId());
        donation.setInvoiceUrl(invoice.getInvoiceUrl()); // URL untuk scan QR atau redirect

        donationRepository.save(donation);

        publisher.publishEvent(new DonationSuccessEvent(this, campaign.getCreatedBy().getEmail(), campaign.getTitle(), amount));

        return DonationResponse.builder()
                .id(donation.getId())
                .externalId(donation.getExternalId())
                .amount(donation.getAmount())
                .paymentMethod(donation.getPaymentMethod())
                .status(donation.getStatus())
                .invoiceUrl(donation.getInvoiceUrl())
                .xenditInvoiceId(donation.getXenditInvoiceId())
                .build();
    }

    @Override
    @Transactional
    public void handleWebhook(Map<String, Object> payload) {
        String externalId = (String) payload.get("external_id");
        String status = (String) payload.get("status");

        Donation donation = donationRepository.findByExternalId(externalId);
        if (donation != null) {
            DonationStatus previousStatus = donation.getStatus();

            switch (status) {
                case "PAID" -> donation.setStatus(DonationStatus.CONFIRMED);
                case "EXPIRED", "CANCELLED" -> donation.setStatus(DonationStatus.FAILED);
                default -> donation.setStatus(DonationStatus.PENDING);
            }

            donationRepository.save(donation);

            // Hanya update collectedAmount jika status berubah menjadi CONFIRMED dari
            // status lain
            if (donation.getStatus() == DonationStatus.CONFIRMED &&
                    previousStatus != DonationStatus.CONFIRMED) {

                Campaign campaign = donation.getCampaign();
                campaign.setCollectedAmount(campaign.getCollectedAmount() + donation.getAmount());
                campaignRepository.save(campaign);
            }
        }
    }

    @Override
    public List<DonationResponse> getUserDonations(String userId) {
        List<Donation> donations = donationRepository.findByUserId(userId);

        return donations.stream()
                .map(d -> DonationResponse.builder()
                        .id(d.getId())
                        .externalId(d.getExternalId())
                        .amount(d.getAmount())
                        .paymentMethod(d.getPaymentMethod())
                        .status(d.getStatus())
                        .invoiceUrl(d.getInvoiceUrl())
                        .xenditInvoiceId(d.getXenditInvoiceId())
                        .donatedAt(d.getDonatedAt())
                        .build())
                .toList();
    }

    @Override
    public Page<HistoryDonationAllResponse> getAllDonations(Pageable pageable) {
        return donationRepository.findAll(pageable)
                .map(d -> HistoryDonationAllResponse.fromEntity(d));
    }
}
