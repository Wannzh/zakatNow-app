package com.zakatnow.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zakatnow.backend.entity.User;

public interface UserRepository extends JpaRepository<User, String>{
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

}
