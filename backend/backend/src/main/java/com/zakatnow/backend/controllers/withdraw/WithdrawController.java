package com.zakatnow.backend.controllers.withdraw;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zakatnow.backend.dto.withdraw.WithdrawRequest;
import com.zakatnow.backend.dto.withdraw.WithdrawResponse;
import com.zakatnow.backend.services.withdraw.WithdrawService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/withdraws")
@RequiredArgsConstructor
public class WithdrawController {
    private final WithdrawService withdrawService;

    @PostMapping("/request")
    public ResponseEntity<WithdrawResponse> requestWithdraw(@RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(withdrawService.requestWithdraw(request));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<WithdrawResponse> approveWithdraw(
            @PathVariable String id,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(withdrawService.approveWithdraw(id, note));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<WithdrawResponse> rejectWithdraw(
            @PathVariable String id,
            @RequestParam String reason) {
        return ResponseEntity.ok(withdrawService.rejectWithdraw(id, reason));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<WithdrawResponse>> getWithdrawsByCampaign(@PathVariable String campaignId) {
        return ResponseEntity.ok(withdrawService.getWithdrawsByCampaign(campaignId));
    }

    @GetMapping
    public ResponseEntity<List<WithdrawResponse>> getAllWithdraws() {
        return ResponseEntity.ok(withdrawService.getAllWithdraws());
    }
}
