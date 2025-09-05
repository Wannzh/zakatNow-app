package com.zakatnow.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

   @Bean
    public Cloudinary getCloudinary() {
        return new Cloudinary(System.getenv("CLOUDINARY_URL"));
    }
}