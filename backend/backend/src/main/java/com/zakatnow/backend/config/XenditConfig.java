package com.zakatnow.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.xendit.Xendit;

import jakarta.annotation.PostConstruct;

@Configuration
// @Profile({"!test"})
public class XenditConfig {
    @Value("${xendit.api.key}")
    private String apiKey;

    @PostConstruct
    public void init() {
        System.out.println("Xendit API key: " + apiKey);
        Xendit.apiKey = apiKey;
    }
}
