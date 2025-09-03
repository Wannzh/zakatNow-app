package com.zakatnow.backend.dto.withdraw;

import java.time.LocalDateTime;

import com.zakatnow.backend.enums.WithdrawStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WithdrawResponse {
    private String id;
    private String campaignId;
    private String campaignTitle;
    private Double amount;
    private WithdrawStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private String note;
    private String rejectedReason;
}
