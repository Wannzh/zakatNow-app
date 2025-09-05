package com.zakatnow.backend.services.report;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
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
    private final Cloudinary cloudinary;

    private ReportResponse mapToReportResponse(Report report) {
        String format = "excel";
        if (report.getFileUrl() != null && report.getFileUrl().toLowerCase().endsWith(".pdf")) {
            format = "pdf";
        }
        return ReportResponse.builder()
                .id(report.getId())
                .description(report.getDescription())
                .fileUrl(report.getFileUrl())
                .reportDate(report.getReportDate())
                .campaignId(report.getCampaign().getId())
                .campaignTitle(report.getCampaign().getTitle())
                .format(format)
                .build();
    }

    @Override
    public ReportResponse createExcelReport(String campaignId, String description, LocalDate startDate, LocalDate endDate) throws IOException {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        List<Donation> donations = donationRepository.findByCampaignId(campaignId).stream()
                .filter(d -> d.getDonatedAt() != null &&
                        !d.getDonatedAt().toLocalDate().isBefore(startDate) &&
                        !d.getDonatedAt().toLocalDate().isAfter(endDate))
                .toList();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Donations Report");
            
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setBold(true);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);

            CellStyle amountStyle = workbook.createCellStyle();
            amountStyle.cloneStyleFrom(dataStyle);
            amountStyle.setAlignment(HorizontalAlignment.RIGHT);
            amountStyle.setDataFormat(workbook.createDataFormat().getFormat("Rp #,##0.00"));

            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.cloneStyleFrom(dataStyle);
            dateStyle.setDataFormat(workbook.createDataFormat().getFormat("dd-MM-yyyy HH:mm"));

            try (InputStream is = new ClassPathResource("static/logo-doc.png").getInputStream()) {
                byte[] bytes = IOUtils.toByteArray(is);
                int pictureIdx = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
                CreationHelper helper = workbook.getCreationHelper();
                Drawing<?> drawing = sheet.createDrawingPatriarch();
                ClientAnchor anchor = helper.createClientAnchor();
                anchor.setCol1(0);
                anchor.setRow1(0);
                Picture pict = drawing.createPicture(anchor, pictureIdx);
                pict.resize(2, 3);
            } catch (Exception e) {
                System.out.println("Logo not found, skipping...");
            }

            int rowIdx = 0;

            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(2);
            titleCell.setCellValue("Donation Report");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 2, 5));

            Row infoRow1 = sheet.createRow(rowIdx++);
            infoRow1.createCell(2).setCellValue("Campaign: " + campaign.getTitle());
            Row infoRow2 = sheet.createRow(rowIdx++);
            infoRow2.createCell(2).setCellValue("Period: " + startDate + " to " + endDate);
            rowIdx++;

            String[] columns = { "Donor Name", "Email", "Amount", "Payment Method", "Status", "Donated At" };
            Row header = sheet.createRow(rowIdx++);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            for (Donation d : donations) {
                Row row = sheet.createRow(rowIdx++);
                String donorName = (d.getUser() != null) ? d.getUser().getFullName() : "Anonymous";
                String donorEmail = (d.getUser() != null) ? d.getUser().getEmail() : "N/A";

                row.createCell(0).setCellValue(donorName);
                row.createCell(1).setCellValue(donorEmail);
                Cell amountCell = row.createCell(2);
                amountCell.setCellValue(d.getAmount());
                amountCell.setCellStyle(amountStyle);
                row.createCell(3).setCellValue(d.getPaymentMethod().name());
                row.createCell(4).setCellValue(d.getStatus().name());
                Cell dateCell = row.createCell(5);
                dateCell.setCellValue(d.getDonatedAt());
                dateCell.setCellStyle(dateStyle);

                for(int i=0; i<columns.length; i++) {
                    if(row.getCell(i) != null) {
                        row.getCell(i).setCellStyle(dataStyle);
                    }
                }
                amountCell.setCellStyle(amountStyle);
                dateCell.setCellStyle(dateStyle);
            }

            double totalAmount = donations.stream().mapToDouble(Donation::getAmount).sum();
            Row summaryRow = sheet.createRow(rowIdx + 1);
            Cell totalLabelCell = summaryRow.createCell(0);
            totalLabelCell.setCellValue("TOTAL DONATION");
            totalLabelCell.setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx + 1, rowIdx + 1, 0, 1));
            Cell totalValueCell = summaryRow.createCell(2);
            totalValueCell.setCellValue(totalAmount);
            totalValueCell.setCellStyle(amountStyle);

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            byte[] fileBytes = baos.toByteArray();
            
            String fileName = "reports/report-" + campaign.getId() + "-" + System.currentTimeMillis();
            Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap("public_id", fileName, "resource_type", "raw", "format", "xlsx"));
            String fileUrl = uploadResult.get("secure_url").toString();
            
            Report report = Report.builder()
                    .description(description)
                    .fileUrl(fileUrl)
                    .reportDate(LocalDate.now())
                    .campaign(campaign)
                    .build();
            Report savedReport = reportRepository.save(report);
            return mapToReportResponse(savedReport);
        }
    }

    @Override
    public ReportResponse createPdfReport(String campaignId, String description, LocalDate startDate, LocalDate endDate) throws IOException {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        List<Donation> donations = donationRepository.findByCampaignId(campaignId).stream()
                .filter(d -> d.getDonatedAt() != null &&
                        !d.getDonatedAt().toLocalDate().isBefore(startDate) &&
                        !d.getDonatedAt().toLocalDate().isAfter(endDate))
                .toList();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        try (InputStream is = new ClassPathResource("static/logo-doc.png").getInputStream()) {
            Image logo = Image.getInstance(IOUtils.toByteArray(is));
            logo.scaleToFit(100, 50);
            logo.setAlignment(Image.LEFT);
            document.add(logo);
        } catch (Exception e) {
            System.out.println("Logo not found, skipping...");
        }

        com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 16, com.lowagie.text.Font.BOLD);
        Paragraph title = new Paragraph("Donation Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        document.add(new Paragraph("Campaign: " + campaign.getTitle()));
        document.add(new Paragraph("Period: " + startDate + " to " + endDate));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 2, 3, 2, 2, 2, 3 });

        String[] headers = { "Donor Name", "Email", "Amount", "Payment Method", "Status", "Donated At" };
        for (String h : headers) {
            com.lowagie.text.Font headerFontPdf = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 12, com.lowagie.text.Font.BOLD);
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFontPdf));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(new Color(230, 230, 230));
            cell.setPadding(6f);
            table.addCell(cell);
        }

        for (Donation d : donations) {
            String donorName = (d.getUser() != null) ? d.getUser().getFullName() : "Anonymous";
            String donorEmail = (d.getUser() != null) ? d.getUser().getEmail() : "N/A";
            table.addCell(donorName);
            table.addCell(donorEmail);
            table.addCell(String.format("Rp %,.2f", d.getAmount()));
            table.addCell(d.getPaymentMethod().name());
            table.addCell(d.getStatus().name());
            table.addCell(d.getDonatedAt().format(dtf));
        }

        double totalAmount = donations.stream().mapToDouble(Donation::getAmount).sum();
        PdfPCell totalCell = new PdfPCell(new Phrase("TOTAL DONATION", new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 12, com.lowagie.text.Font.BOLD)));
        totalCell.setColspan(2);
        totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        totalCell.setBackgroundColor(new Color(200, 200, 200));
        totalCell.setPadding(6f);
        table.addCell(totalCell);
        PdfPCell totalValue = new PdfPCell(new Phrase(String.format("Rp %,.2f", totalAmount)));
        totalValue.setColspan(4);
        totalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalValue.setPadding(6f);
        table.addCell(totalValue);
        
        document.add(table);
        document.close();

        byte[] fileBytes = baos.toByteArray();
        String fileName = "reports/report-" + campaign.getId() + "-" + System.currentTimeMillis();
        Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap("public_id", fileName, "resource_type", "raw", "format", "pdf"));
        String fileUrl = uploadResult.get("secure_url").toString();
        
        Report report = Report.builder()
                .description(description)
                .fileUrl(fileUrl)
                .reportDate(LocalDate.now())
                .campaign(campaign)
                .build();
        Report savedReport = reportRepository.save(report);
        return mapToReportResponse(savedReport);
    }

    @Override
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponse getReportById(String id) {
        Report report = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        return mapToReportResponse(report);
    }

    @Override
    public byte[] downloadReportFile(String id) throws IOException {
        Report report = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        try (InputStream in = new URL(report.getFileUrl()).openStream()) {
            return in.readAllBytes();
        }
    }
}