package com.zakatnow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.zakatnow.backend.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
                return authConfig.getAuthenticationManager();
        }

        @SuppressWarnings("removal")
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.cors();
                http.csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                // public
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-resources/**",
                                                                "/configuration/ui",
                                                                "/configuration/security",
                                                                "/webjars/**",
                                                                "/api/donations/webhook/xendit",
                                                                "/api/test-email/**")
                                                .permitAll()

                                                // Admin
                                                .requestMatchers(
                                                                "api/campaigns/{id}/cancel",
                                                                "api/campaigns/{id}/request-cancel",
                                                                "/api/campaigns/update/**",
                                                                "/api/role-upgrade/admin/**",
                                                                "/api/donations/admin/history",
                                                                "/api/reports",
                                                                "/api/reports/**",
                                                                "/api/withdraws",
                                                                "/api/withdraws/{id}/**")
                                                .hasAuthority("ROLE_ADMIN")

                                                // Campaigner
                                                .requestMatchers(
                                                                "api/withdraws/request",
                                                                "api/withdraws/campaign/{campaignId}")
                                                .hasAuthority("ROLE_CAMPAIGNER")

                                                // User
                                                .requestMatchers(
                                                                "api/role-upgrade/request/{userId}",
                                                                "api/donations/create",
                                                                "api/donations/history")
                                                .hasAuthority("ROLE_USER")

                                                // All Role
                                                .requestMatchers(
                                                                "api/campaigns",
                                                                "api/campaigns/{id}")
                                                .hasAnyAuthority("ROLE_USER", "ROLE_CAMPAIGNER", "ROLE_ADMIN")

                                                // CAMPAIGNER + Admin
                                                .requestMatchers("/api/campaigns/create")
                                                .hasAnyAuthority("ROLE_CAMPAIGNER", "ROLE_ADMIN")

                                                // All Authenticated
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
