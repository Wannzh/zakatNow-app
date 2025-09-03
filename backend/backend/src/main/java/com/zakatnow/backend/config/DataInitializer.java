package com.zakatnow.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.zakatnow.backend.entity.Role;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.ERole;
import com.zakatnow.backend.repository.RoleRepository;
import com.zakatnow.backend.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {
    @Value("${ADMIN_USERNAME}")
    private String adminUsername;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Value("${ADMIN_FULLNAME:Administrator}")
    private String adminFullName;

    @Value("${ADMIN_PHONE:}")
    private String adminPhone;

    @Value("${ADMIN_ADDRESS:}")
    private String adminAddress;

    @Bean
    CommandLineRunner initData(RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // --- Inisialisasi Roles ---
            for (ERole erole : ERole.values()) {
                roleRepository.findByName(erole).orElseGet(() -> {
                    Role role = new Role();
                    role.setName(erole);
                    return roleRepository.save(role);
                });
            }

            // --- Inisialisasi Admin Default ---
            if (!userRepository.existsByUsername(adminUsername)) {
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User admin = User.builder()
                        .username(adminUsername)
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .fullName(adminFullName)
                        .phoneNumber(adminPhone)
                        .address(adminAddress)
                        .enabled(true)
                        .roles(roles)
                        .build();

                userRepository.save(admin);
                System.out.printf("Default admin account created: %s%n", adminUsername);
            }
        };
    }
}
