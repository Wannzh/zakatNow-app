package com.zakatnow.backend.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    // Mengambil username & password dari Environment Variables Render
    @Value("${SPRING_MAIL_USERNAME}")
    private String mailUsername;

    @Value("${SPRING_MAIL_PASSWORD}")
    private String mailPassword;

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        // Gunakan Port 465 (SMTPS)
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(465);
        mailSender.setProtocol("smtps"); // Penting: protocol smtps
        
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtps");
        props.put("mail.smtps.auth", "true");
        props.put("mail.smtps.ssl.enable", "true"); // SSL aktif sejak awal
        props.put("mail.smtps.quitwait", "false");
        
        // Debugging
        props.put("mail.debug", "true");
        
        // Timeout settings (30 detik)
        props.put("mail.smtps.connectiontimeout", "30000");
        props.put("mail.smtps.timeout", "30000");
        props.put("mail.smtps.writetimeout", "30000");

        return mailSender;
    }
}