package com.zakatnow.backend.dto.withdraw;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WithdrawRequest {
    private String campaignId;
    private Double amount;
    private String note;
}
