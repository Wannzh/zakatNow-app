package com.zakatnow.backend.services.notification;

import java.io.InputStream;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailNotificationServiceImpl implements EmailNotificationService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    private void sendHtmlEmail(String to, String subject, String templateName, Context context) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8"); // <- true artinya multipart

            String htmlContent = templateEngine.process("email/" + templateName, context);
            helper.setText(htmlContent, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(new InternetAddress("alwanfdhlrhmn@gmail.com", "ZakatNow"));


            // attach logo sebagai inline image
            try (InputStream logoStream = new ClassPathResource("static/logo-doc.png").getInputStream()) {
                if (logoStream != null) {
                    helper.addInline("logo-doc", new ByteArrayResource(logoStream.readAllBytes()), "image/png");
                } else {
                    System.out.println("Logo tidak ditemukan di resources/static/");
                }
            }

            mailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendRegistrationSuccess(String to, String fullName) {
        Context ctx = new Context();
        ctx.setVariable("fullName", fullName);
        System.out.println("DEBUG fullName = " + fullName);
        sendHtmlEmail(to, "Welcome to ZakatNow", "registration", ctx);
    }

    @Override
    public void sendRoleUpgradeResult(String to, String name, boolean approved) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
        ctx.setVariable("status", approved ? "disetujui" : "ditolak");
        sendHtmlEmail(to, "Hasil Permintaan Upgrade Role", "role-upgrade", ctx);
    }

    @Override
    public void sendDonationNotification(String to, String campaignName, double amount) {
        Context ctx = new Context();
        ctx.setVariable("campaignName", campaignName);
        ctx.setVariable("amount", amount);
        sendHtmlEmail(to, "Donasi Baru untuk Kampanye", "donation", ctx);
    }

    @Override
    public void sendCampaignDeadlineReminder(String to, String campaignName, String deadlineDate) {
        Context ctx = new Context();
        ctx.setVariable("campaignName", campaignName);
        ctx.setVariable("deadlineDate", deadlineDate);
        sendHtmlEmail(to, "Pengingat Deadline Kampanye", "campaign-deadline", ctx);
    }
}
