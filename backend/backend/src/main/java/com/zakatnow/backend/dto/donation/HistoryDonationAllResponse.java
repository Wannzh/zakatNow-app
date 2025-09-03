package com.zakatnow.backend.dto.donation;

import java.time.LocalDateTime;

import com.zakatnow.backend.entity.Donation;
import com.zakatnow.backend.enums.DonationStatus;
import com.zakatnow.backend.enums.PaymentMethod;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HistoryDonationAllResponse {
    private String id;
    private String externalId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private DonationStatus status;
    private String invoiceUrl;
    private String xenditInvoiceId;
    private LocalDateTime donatedAt;
    private String donorName;
    private String donorEmail;
    private String campaignTitle;

    public static HistoryDonationAllResponse fromEntity(Donation d) {
        return HistoryDonationAllResponse.builder()
                .id(d.getId())
                .externalId(d.getExternalId())
                .amount(d.getAmount())
                .paymentMethod(d.getPaymentMethod())
                .status(d.getStatus())
                .invoiceUrl(d.getInvoiceUrl())
                .xenditInvoiceId(d.getXenditInvoiceId())
                .donatedAt(d.getDonatedAt())
                .donorName(d.getUser() != null ? d.getUser().getFullName() : null)
                .donorEmail(d.getUser() != null ? d.getUser().getEmail() : null)
                .campaignTitle(d.getCampaign() != null ? d.getCampaign().getTitle() : null)
                .build();
    }
}
