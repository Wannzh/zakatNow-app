package com.zakatnow.backend.services.report;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.zakatnow.backend.dto.report.ReportResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.Donation;
import com.zakatnow.backend.entity.Report;
import com.zakatnow.backend.repository.CampaignRepository;
import com.zakatnow.backend.repository.DonationRepository;
import com.zakatnow.backend.repository.ReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;

    @Override
    public ReportResponse createReport(String campaignId, String description, LocalDate startDate, LocalDate endDate)
            throws IOException {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // Ambil donasi berdasarkan campaign + periode
        List<Donation> donations = donationRepository.findByCampaignId(campaignId).stream()
                .filter(d -> !d.getDonatedAt().toLocalDate().isBefore(startDate) &&
                        !d.getDonatedAt().toLocalDate().isAfter(endDate))
                .toList();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Donations Report");

            // Header
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Donor Name");
            header.createCell(1).setCellValue("Email");
            header.createCell(2).setCellValue("Amount");
            header.createCell(3).setCellValue("Payment Method");
            header.createCell(4).setCellValue("Status");
            header.createCell(5).setCellValue("Donated At");

            // Data
            int rowIdx = 1;
            for (Donation d : donations) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(d.getUser().getFullName());
                row.createCell(1).setCellValue(d.getUser().getEmail());
                row.createCell(2).setCellValue(d.getAmount());
                row.createCell(3).setCellValue(d.getPaymentMethod().name());
                row.createCell(4).setCellValue(d.getStatus().name());
                row.createCell(5).setCellValue(d.getDonatedAt().toString());
            }

            // Auto-size kolom
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // Simpan file lokal
            String fileName = "report-" + campaignId + "-" + System.currentTimeMillis() + ".xlsx";
            String filePath = "reports/" + fileName;
            File dir = new File("reports");
            if (!dir.exists())
                dir.mkdirs();

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                workbook.write(fos);
            }

            // Simpan metadata ke DB
            Report report = Report.builder()
                    .description(description)
                    .fileUrl(filePath)
                    .reportDate(LocalDate.now())
                    .campaign(campaign)
                    .build();

            reportRepository.save(report);

            return ReportResponse.builder()
                    .id(report.getId())
                    .description(report.getDescription())
                    .fileUrl(report.getFileUrl())
                    .reportDate(report.getReportDate())
                    .campaignId(campaign.getId())
                    .campaignTitle(campaign.getTitle())
                    .build();
        }
    }

    @Override
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(r -> ReportResponse.builder()
                        .id(r.getId())
                        .description(r.getDescription())
                        .fileUrl(r.getFileUrl())
                        .reportDate(r.getReportDate())
                        .campaignId(r.getCampaign().getId())
                        .campaignTitle(r.getCampaign().getTitle())
                        .build())
                .toList();
    }

    @Override
    public ReportResponse getReportById(String id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        return ReportResponse.builder()
                .id(report.getId())
                .description(report.getDescription())
                .fileUrl(report.getFileUrl())
                .reportDate(report.getReportDate())
                .campaignId(report.getCampaign().getId())
                .campaignTitle(report.getCampaign().getTitle())
                .build();
    }

    @Override
    public byte[] downloadReportFile(String id) throws IOException {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        File file = new File(report.getFileUrl());
        if (!file.exists()) {
            throw new RuntimeException("Report file not found");
        }

        return Files.readAllBytes(file.toPath());
    }
}
