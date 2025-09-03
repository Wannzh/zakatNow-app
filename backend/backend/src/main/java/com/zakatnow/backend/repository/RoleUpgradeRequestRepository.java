package com.zakatnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.RoleUpgradeRequest;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.RequestStatus;

public interface RoleUpgradeRequestRepository extends JpaRepository<RoleUpgradeRequest, String> {
    List<RoleUpgradeRequest> findByUser(User user);
    boolean existsByUserAndStatus(User user, RequestStatus status);
}
