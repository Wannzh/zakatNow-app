package com.zakatnow.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "Username tidak boleh kosong")
    private String username;

    @Email(message = "Format email tidak valid")
    private String email;
    
    @NotBlank(message = "Password tidak boleh kosong")
    @Size(min = 8, message = "Password minimal 8 karakter")
    private String password;

    @NotBlank(message = "Nama lengkap wajib diisi")
    private String fullName;

    @Pattern(regexp = "^(\\+62|0)[0-9]{9,13}$", 
             message = "Nomor HP harus valid dan dimulai dengan +62 atau 0")
    private String phoneNumber;
    private String address;
}
