package com.zakatnow.backend.services.permission;

import java.time.LocalDateTime;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.zakatnow.backend.entity.Role;
import com.zakatnow.backend.entity.RoleUpgradeRequest;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.ERole;
import com.zakatnow.backend.enums.RequestStatus;
import com.zakatnow.backend.event.UserUpgradeRoleEvent;
import com.zakatnow.backend.repository.RoleRepository;
import com.zakatnow.backend.repository.RoleUpgradeRequestRepository;
import com.zakatnow.backend.repository.UserRepository;
import com.zakatnow.backend.services.notification.EmailNotificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleUpgradeServiceImpl implements RoleUpgradeService {
    private final RoleUpgradeRequestRepository requestRepository;
    private final EmailNotificationService emailNotificationService;
    private final ApplicationEventPublisher publisher;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public RoleUpgradeRequest requestUpgrade(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userRepository.existsAsCampaigner(userId)) {
            throw new IllegalStateException("User sudah menjadi Campaigner");
        }

        // gunakan existsByUserAndStatus (lebih efisien daripada find + stream)
        if (requestRepository.existsByUserAndStatus(user, RequestStatus.PENDING)) {
            throw new IllegalStateException("Masih ada request yang pending");
        }

        RoleUpgradeRequest request = RoleUpgradeRequest.builder()
                .user(user)
                .requestedRole(ERole.ROLE_CAMPAIGNER)
                .status(RequestStatus.PENDING) // <-- pakai RequestStatus top-level
                .createdAt(LocalDateTime.now())
                .build();

        return requestRepository.save(request);
    }

    @Transactional
    @Override
    public String approveRequest(String requestId) {
        RoleUpgradeRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request sudah diproses");
        }

        User user = request.getUser();
        Role campaignerRole = roleRepository.findByName(ERole.ROLE_CAMPAIGNER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // pastikan set roles (Set) -> duplicate otomatis di-handle karena Set
        user.getRoles().add(campaignerRole);
        userRepository.save(user);

        request.setStatus(RequestStatus.APPROVED);
        requestRepository.save(request);

        // kirim notifikasi hasil
        publisher.publishEvent(new UserUpgradeRoleEvent(this, user.getEmail(), user.getFullName()));

        return user.getUsername();
    }

    @Transactional
    @Override
    public String rejectRequest(String requestId) {
        RoleUpgradeRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request sudah diproses");
        }

        User user = request.getUser();

        request.setStatus(RequestStatus.REJECTED);
        requestRepository.save(request);

        // kirim notifikasi hasil
        publisher.publishEvent(new UserUpgradeRoleEvent(this, user.getEmail(), user.getFullName()));

        return user.getUsername();
    }
}
