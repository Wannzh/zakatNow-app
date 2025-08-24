package com.zakatnow.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApi {
    @Bean
    public OpenAPI openAPI() {
        Server server = new Server()
            .url("http://localhost:8080")
            .description("ZakatNow");

        Contact contact = new Contact()
            .url("isi dengan url hosting nanti")
            .name("Hubungin Alwan Developer ZakatNow")
            .email("alwanfdhlrhmn@gmail.com");

        License license = new License()
            .name("Apache License 2.0")
            .url("https://www.apache.org/licenses/LICENSE-2.0");

        Info info = new Info()
            .title("API ZakatNow")
            .version("1.0.0")
            .summary("Dokumentasi REST API Sistem Informasi ZakatNow")
            .description("Aplikasi pengelolaan zakat.")
            .contact(contact)
            .termsOfService("isi dengan url hosting nanti")
            .license(license);

        SecurityScheme securityScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT");

        SecurityRequirement securityRequirement = new SecurityRequirement()
            .addList("Bearer Authentication");

        return new OpenAPI()
            .info(info)
            .addSecurityItem(securityRequirement)
            .components(new Components().addSecuritySchemes("Bearer Authentication", securityScheme))
            .servers(List.of(server));
    }
}
