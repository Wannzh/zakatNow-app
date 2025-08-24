package com.zakatnow.backend.config;

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
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@zakatnow.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // default password
                admin.setFullName("Administrator");
                admin.setPhoneNumber("081234567890");
                admin.setAddress("ZakatNow HQ");
                admin.setEnabled(true);

                // Set role ADMIN
                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));
                roles.add(adminRole);
                admin.setRoles(roles);

                userRepository.save(admin);
                System.out.println("Default admin account created: admin / admin123");
            }
        };
    }
}
