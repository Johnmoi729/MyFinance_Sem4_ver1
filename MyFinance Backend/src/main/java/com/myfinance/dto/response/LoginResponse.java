package com.myfinance.dto.response;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private LocalDateTime lastLogin;
    private Long expiresIn;
    private List<String> roles;
}