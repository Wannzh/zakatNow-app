package com.zakatnow.backend.services.auth;

import org.springframework.http.ResponseEntity;

import com.zakatnow.backend.dto.auth.JwtResponse;
import com.zakatnow.backend.dto.auth.LoginRequest;
import com.zakatnow.backend.dto.auth.SignupRequest;
import com.zakatnow.backend.dto.common.MessageResponse;

public interface AuthService {
    ResponseEntity<JwtResponse> login(LoginRequest loginRequest);
    ResponseEntity<MessageResponse> register(SignupRequest signupRequest);
}
