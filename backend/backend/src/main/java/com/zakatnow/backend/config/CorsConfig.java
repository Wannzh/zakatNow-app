package com.zakatnow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Mengizinkan semua endpoint
                        .allowedOrigins("http://localhost:5173", "https://zakat-now-frontend.vercel.app", "https://zakatnow.alwanfdh.my.id", "https://api-zakatnow.alwanfdh.my.id/swagger-ui/index.html#/") // Mengizinkan akses dari semua domain
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Metode HTTP yang diizinkan
                        .allowedHeaders("*") // Mengizinkan semua header
                        .allowCredentials(true); // Mengizinkan penggunaan kredensial 
            }
        };
    }
}
