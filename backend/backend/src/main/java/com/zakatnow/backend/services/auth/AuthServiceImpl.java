package com.zakatnow.backend.services.auth;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zakatnow.backend.dto.auth.JwtResponse;
import com.zakatnow.backend.dto.auth.LoginRequest;
import com.zakatnow.backend.dto.auth.SignupRequest;
import com.zakatnow.backend.dto.common.MessageResponse;
import com.zakatnow.backend.entity.Role;
import com.zakatnow.backend.entity.User;
import com.zakatnow.backend.enums.ERole;
import com.zakatnow.backend.event.UserRegisteredEvent;
import com.zakatnow.backend.exception.UserNotFoundException;
import com.zakatnow.backend.repository.RoleRepository;
import com.zakatnow.backend.repository.UserRepository;
import com.zakatnow.backend.security.CustomeUserDetails;
import com.zakatnow.backend.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final AuthenticationManager authenticationManager;
         private final ApplicationEventPublisher publisher;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder encoder;
        private final JwtUtils jwtUtils;

        @Override
        public ResponseEntity<JwtResponse> login(LoginRequest loginRequest) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtils.generateJwtToken(authentication);

                var userDetails = (CustomeUserDetails) authentication.getPrincipal();

                List<String> roles = userDetails.getAuthorities().stream()
                                .map(auth -> auth.getAuthority())
                                .collect(Collectors.toList());

                JwtResponse response = new JwtResponse(
                                jwt,
                                userDetails.getId(),
                                userDetails.getUsername(),
                                userDetails.getEmail(),
                                roles);

                return ResponseEntity.ok(response);
        }

        @Override
        public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
                if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                        return ResponseEntity.badRequest()
                                        .body(new MessageResponse("Error: Username sudah dipakai!"));
                }

                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                        return ResponseEntity.badRequest()
                                        .body(new MessageResponse("Error: Email sudah dipakai!"));
                }

                User user = User.builder()
                                .username(signUpRequest.getUsername())
                                .email(signUpRequest.getEmail())
                                .password(encoder.encode(signUpRequest.getPassword()))
                                .fullName(signUpRequest.getFullName())
                                .phoneNumber(signUpRequest.getPhoneNumber())
                                .address(signUpRequest.getAddress())
                                .createdAt(LocalDateTime.now())
                                .enabled(true)
                                .build();

                // Default role USER
                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new UserNotFoundException("Role ROLE_USER tidak ditemukan."));

                Set<Role> roles = new HashSet<>();
                roles.add(userRole);

                user.setRoles(roles);
                userRepository.save(user);

                publisher.publishEvent(new UserRegisteredEvent(this, user.getEmail(), user.getFullName()));

                return ResponseEntity.ok(new MessageResponse("User berhasil registrasi!"));
        }

}
