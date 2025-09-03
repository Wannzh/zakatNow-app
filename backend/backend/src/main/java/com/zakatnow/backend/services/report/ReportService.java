package com.zakatnow.backend.services.report;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import com.zakatnow.backend.dto.report.ReportResponse;

public interface ReportService {
    ReportResponse createExcelReport(String campaignId, String description, LocalDate startDate, LocalDate endDate) throws IOException;
    ReportResponse createPdfReport(String campaignId, String description, LocalDate startDate, LocalDate endDate) throws IOException;
    // Ambil semua report
    List<ReportResponse> getAllReports();
    // Ambil metadata report by id
    ReportResponse getReportById(String id);
    // Endpoint khusus untuk download file
    byte[] downloadReportFile(String id) throws IOException;
}
