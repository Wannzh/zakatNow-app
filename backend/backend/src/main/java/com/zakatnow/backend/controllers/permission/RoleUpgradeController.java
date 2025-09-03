package com.zakatnow.backend.controllers.permission;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zakatnow.backend.entity.RoleUpgradeRequest;
import com.zakatnow.backend.services.permission.RoleUpgradeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/role-upgrade")
@RequiredArgsConstructor
public class RoleUpgradeController {
    private final RoleUpgradeService roleUpgradeService;

    @PostMapping("/request/{userId}")
    public ResponseEntity<RoleUpgradeRequest> requestUpgrade(@PathVariable String userId) {
        return ResponseEntity.ok(roleUpgradeService.requestUpgrade(userId));
    }

    @PostMapping("/admin/approve/{requestId}")
    public ResponseEntity<String> approve(@PathVariable String requestId) {
        String username = roleUpgradeService.approveRequest(requestId);
        return ResponseEntity.ok("Approved user: " + username);
    }

    @PostMapping("/admin/reject/{requestId}")
    public ResponseEntity<String> reject(@PathVariable String requestId) {
        String username = roleUpgradeService.rejectRequest(requestId);
        return ResponseEntity.ok("Rejected user: " + username);
    }
}
