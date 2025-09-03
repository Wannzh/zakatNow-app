package com.zakatnow.backend.controllers.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zakatnow.backend.dto.auth.JwtResponse;
import com.zakatnow.backend.dto.auth.LoginRequest;
import com.zakatnow.backend.dto.auth.SignupRequest;
import com.zakatnow.backend.dto.common.MessageResponse;
import com.zakatnow.backend.services.auth.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }
}
