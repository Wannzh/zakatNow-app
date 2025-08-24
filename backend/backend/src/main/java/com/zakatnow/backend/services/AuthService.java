package com.zakatnow.backend.services;

import org.springframework.http.ResponseEntity;

import com.zakatnow.backend.dto.auth.JwtResponse;
import com.zakatnow.backend.dto.auth.LoginRequest;
import com.zakatnow.backend.dto.auth.SignupRequest;

public interface AuthService {
    ResponseEntity<JwtResponse> login(LoginRequest loginRequest);
    ResponseEntity<?> register(SignupRequest signupRequest);
}
