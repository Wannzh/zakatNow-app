package com.zakatnow.backend.controllers;

import com.zakatnow.backend.services.notification.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailNotificationService emailService;

    // kirim email welcome
    @PostMapping("/registration")
    public ResponseEntity<String> testRegistration(
            @RequestParam String to,
            @RequestParam String name) {
        emailService.sendRegistrationSuccess(to, name);
        return ResponseEntity.ok("Email registration terkirim ke " + to);
    }

    // kirim hasil upgrade role
    @PostMapping("/role")
    public ResponseEntity<String> testRole(
            @RequestParam String to,
            @RequestParam String name,
            @RequestParam(defaultValue = "true") boolean approved) {
        emailService.sendRoleUpgradeResult(to, name, approved);
        return ResponseEntity.ok("Email role upgrade terkirim ke " + to);
    }

    // kirim notifikasi donasi
    @PostMapping("/donation")
    public ResponseEntity<String> testDonation(
            @RequestParam String to,
            @RequestParam String campaignName,
            @RequestParam double amount) {
        emailService.sendDonationNotification(to, campaignName, amount);
        return ResponseEntity.ok("Email notifikasi donasi terkirim ke " + to);
    }

    // kirim reminder deadline campaign
    @PostMapping("/deadline")
    public ResponseEntity<String> testDeadline(
            @RequestParam String to,
            @RequestParam String campaignName,
            @RequestParam String deadline) {
        emailService.sendCampaignDeadlineReminder(to, campaignName, deadline);
        return ResponseEntity.ok("Email pengingat deadline terkirim ke " + to);
    }
}
    