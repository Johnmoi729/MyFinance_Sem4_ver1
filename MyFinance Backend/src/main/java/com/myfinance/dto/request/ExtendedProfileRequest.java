package com.myfinance.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExtendedProfileRequest {
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2-100 ký tự")
    private String fullName;

    private String phoneNumber;

    private String address;

    private LocalDate dateOfBirth;

    private String avatar; // Base64 encoded or URL
}
