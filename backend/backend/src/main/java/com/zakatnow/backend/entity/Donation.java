package com.zakatnow.backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UuidGenerator;

import com.zakatnow.backend.enums.DonationStatus;
import com.zakatnow.backend.enums.PaymentMethod;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
    @Id
    @GeneratedValue(generator = "uuid")
    @UuidGenerator
    @Column(length = 36, nullable = false)
    private String id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String proofImage; // path atau URL gambar
    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    private LocalDateTime donatedAt;

    // Relasi ke User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Relasi ke Campaign
    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @Column(unique = true)
    private String externalId; // ID unik untuk Xendit

    private String invoiceUrl; // URL pembayaran Xendit

    private String xenditInvoiceId; // ID invoice Xendit
}
