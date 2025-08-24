package com.zakatnow.backend.dto.auth;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String id;
    private String username;
    private String email;
    private List<String> roles;
}
