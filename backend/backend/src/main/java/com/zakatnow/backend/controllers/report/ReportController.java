package com.zakatnow.backend.controllers.report;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zakatnow.backend.dto.report.ReportResponse;
import com.zakatnow.backend.services.report.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    // Create report (pilih format)
    @PostMapping("/create")
    public ReportResponse createReport(
            @RequestParam String campaignId,
            @RequestParam String description,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        if ("pdf".equalsIgnoreCase(format)) {
            return reportService.createPdfReport(campaignId, description, startDate, endDate);
        } else {
            return reportService.createExcelReport(campaignId, description, startDate, endDate);
        }
    }

    // Get all reports metadata
    @GetMapping
    public List<ReportResponse> getAllReports() {
        return reportService.getAllReports();
    }

    // Get report by ID (metadata only)
    @GetMapping("/{id}")
    public ReportResponse getReportById(@PathVariable String id) {
        return reportService.getReportById(id);
    }

    // Download report file
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable String id,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        byte[] fileBytes = reportService.downloadReportFile(id);

        String extension = format.equalsIgnoreCase("pdf") ? ".pdf" : ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report-" + id + extension)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }
}
