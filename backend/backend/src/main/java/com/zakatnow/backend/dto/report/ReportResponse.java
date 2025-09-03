package com.zakatnow.backend.dto.report;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ReportResponse {
    private String id;
    private String description;
    private String fileUrl;
    private LocalDate reportDate;
    private String campaignId;
    private String campaignTitle;
}
