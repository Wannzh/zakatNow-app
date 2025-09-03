package com.zakatnow.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zakatnow.backend.entity.User;

public interface UserRepository extends JpaRepository<User, String>{
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END " +
           "FROM User u JOIN u.roles r " +
           "WHERE u.id = :userId AND r.name = 'ROLE_CAMPAIGNER'")
    boolean existsAsCampaigner(@Param("userId") String userId);
}
