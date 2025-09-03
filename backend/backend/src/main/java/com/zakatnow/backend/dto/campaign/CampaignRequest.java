package com.zakatnow.backend.dto.campaign;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CampaignRequest {
    @NotBlank(message = "Judul tidak boleh kosong")
    private String title;

    @NotBlank(message = "Deskripsi tidak boleh kosong")
    private String description;

    @NotNull(message = "Target donasi harus diisi")
    @Positive(message = "Target donasi harus lebih dari 0")
    private Double targetAmount;

    private String imageUrl;

    @NotNull(message = "Tanggal mulai harus diisi")
    private LocalDate startDate;

    @NotNull(message = "Tanggal akhir harus diisi")
    private LocalDate endDate;
}
