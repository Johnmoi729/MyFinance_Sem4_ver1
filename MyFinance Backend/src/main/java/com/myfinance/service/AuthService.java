package com.myfinance.service;

import com.myfinance.dto.request.*;
import com.myfinance.dto.response.LoginResponse;
import com.myfinance.dto.response.UserResponse;
import com.myfinance.entity.User;
import com.myfinance.exception.BadRequestException;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.UserRepository;
import com.myfinance.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CategoryService categoryService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        user.setIsActive(true);
        user.setIsEmailVerified(false);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Create default categories for the new user
        try {
            categoryService.createDefaultCategoriesForUser(savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to create default categories for user: {}", savedUser.getId(), e);
            // Don't fail registration if category creation fails
        }

        return mapToUserResponse(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        log.info("User login attempt for email: {}", request.getEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            // Get user details
            User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

            // Update last login time
            updateLastLogin(user.getId());

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());

            log.info("User logged in successfully: {}", user.getEmail());

            return LoginResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhoneNumber())
                    .lastLogin(LocalDateTime.now())
                    .expiresIn(jwtUtil.getTokenRemainingTime(token))
                    .build();

        } catch (BadCredentialsException e) {
            log.error("Invalid login credentials for email: {}", request.getEmail());
            throw new BadRequestException("Email hoặc mật khẩu không chính xác");
        }
    }

    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("Updating profile for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);

        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for user ID: {}", userId);

        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Changing password for user ID: {}", userId);

        // Validate new passwords match
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user ID: {}", userId);
    }

    @Transactional
    public void updateLastLogin(Long userId) {
        userRepository.updateLastLogin(userId, LocalDateTime.now());
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Email không tồn tại trong hệ thống"));

        // TODO: Implement email sending logic
        // For now, just log the reset token
        String resetToken = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("Password reset token generated for user {}: {}", user.getEmail(), resetToken);

        // In production, you would send this token via email
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Password reset attempt with token");

        // Validate new passwords match
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }

        // Validate and extract user from token
        try {
            if (!jwtUtil.validateToken(request.getToken())) {
                throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn");
            }

            Long userId = jwtUtil.extractUserId(request.getToken());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            log.info("Password reset successfully for user ID: {}", userId);

        } catch (Exception e) {
            log.error("Password reset failed", e);
            throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn");
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}