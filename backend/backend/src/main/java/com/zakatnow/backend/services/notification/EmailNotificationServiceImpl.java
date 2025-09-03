package com.zakatnow.backend.services.notification;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
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
            // multipart=true agar bisa attach inline image
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            String htmlContent = templateEngine.process("email/" + templateName, context);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("zakatNow@gmail.com");
            helper.setText(htmlContent, true);

            // sisipkan logo sebagai inline image
            ClassPathResource logo = new ClassPathResource("static/logo-email.png");
            if (logo.exists()) {
                helper.addInline("logoEmail", logo);
            }

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendRegistrationSuccess(String to, String name) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
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
