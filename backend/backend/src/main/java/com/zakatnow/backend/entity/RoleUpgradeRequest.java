package com.zakatnow.backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UuidGenerator;

import com.zakatnow.backend.enums.ERole;
import com.zakatnow.backend.enums.RequestStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "role_upgrade_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleUpgradeRequest {
    @Id
    @GeneratedValue(generator = "uuid")
    @UuidGenerator
    @Column(name = "request_id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ERole requestedRole;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
