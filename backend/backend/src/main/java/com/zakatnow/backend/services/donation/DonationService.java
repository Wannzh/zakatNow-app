package com.zakatnow.backend.services.donation;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.xendit.exception.XenditException;
import com.zakatnow.backend.enums.PaymentMethod;
import com.zakatnow.backend.dto.donation.DonationResponse;
import com.zakatnow.backend.dto.donation.HistoryDonationAllResponse;
import com.zakatnow.backend.entity.Campaign;
import com.zakatnow.backend.entity.User;

public interface DonationService {
    DonationResponse createDonationInvoice(User user, Campaign campaign, Double amount, PaymentMethod method)
            throws XenditException;

    void handleWebhook(Map<String, Object> payload);
    List<DonationResponse> getUserDonations(String userId);
    Page<HistoryDonationAllResponse> getAllDonations(Pageable pageable);
}
