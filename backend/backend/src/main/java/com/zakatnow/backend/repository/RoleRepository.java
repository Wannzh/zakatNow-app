package com.zakatnow.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.Role;
import com.zakatnow.backend.enums.ERole;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
