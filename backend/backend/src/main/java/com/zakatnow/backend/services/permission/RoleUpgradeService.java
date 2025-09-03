package com.zakatnow.backend.services.permission;

import com.zakatnow.backend.entity.RoleUpgradeRequest;

public interface RoleUpgradeService {
    RoleUpgradeRequest requestUpgrade(String userId);
    String approveRequest(String requestId);
    String rejectRequest(String requestId);
}
