package com.zakatnow.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import com.zakatnow.backend.enums.CampaignStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {
    @Id
    @GeneratedValue(generator = "uuid")
    @UuidGenerator
    @Column(length = 36, nullable = false)
    private String id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double targetAmount;

    @Builder.Default
    private Double collectedAmount = 0.0;
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;

    @Column(name = "cancel_requested")
    @Builder.Default
    private boolean cancelRequested = false;

    @Column(name = "cancel_reason")
    private String cancelReason;

    // Relasi ke Campaigner
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Relasi ke Donasi
    @Builder.Default
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL)
    private List<Donation> donations = new ArrayList<>();

    // Relasi ke Category
    @Builder.Default
    @ManyToMany
    @JoinTable(name = "campaign_categories", joinColumns = @JoinColumn(name = "campaign_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    // Relasi ke Report
    @Builder.Default
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

}
