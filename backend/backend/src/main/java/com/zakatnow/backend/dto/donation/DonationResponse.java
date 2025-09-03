package com.zakatnow.backend.dto.donation;

import java.time.LocalDateTime;

import com.zakatnow.backend.enums.DonationStatus;
import com.zakatnow.backend.enums.PaymentMethod;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonationResponse {
    private String id;
    private String externalId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private DonationStatus status;
    private String invoiceUrl;
    private String xenditInvoiceId;
    private LocalDateTime donatedAt;
}