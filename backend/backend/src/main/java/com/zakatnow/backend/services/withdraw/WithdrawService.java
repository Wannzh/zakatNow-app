package com.zakatnow.backend.services.withdraw;

import java.util.List;

import com.zakatnow.backend.dto.withdraw.WithdrawRequest;
import com.zakatnow.backend.dto.withdraw.WithdrawResponse;

public interface WithdrawService {
    WithdrawResponse requestWithdraw(WithdrawRequest request);
    WithdrawResponse approveWithdraw(String withdrawId,  String note);
    WithdrawResponse rejectWithdraw(String withdrawId, String reason);
    List<WithdrawResponse> getWithdrawsByCampaign(String campaignId);
    List<WithdrawResponse> getAllWithdraws(); // untuk Admin
}
