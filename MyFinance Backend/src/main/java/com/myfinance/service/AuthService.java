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
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CategoryService categoryService;
    private final RoleService roleService;
    private final EmailService emailService;
    private final UserPreferencesService preferencesService;
    private final OnboardingProgressService onboardingService;

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

        // Assign default USER role
        try {
            roleService.assignDefaultUserRole(savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to assign default role to user: {}", savedUser.getId(), e);
            // Don't fail registration if role assignment fails
        }

        // Create default categories for the new user
        try {
            categoryService.createDefaultCategoriesForUser(savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to create default categories for user: {}", savedUser.getId(), e);
            // Don't fail registration if category creation fails
        }

        // Create default preferences for the new user
        try {
            preferencesService.createDefaultPreferences(savedUser.getId());
            log.info("Default preferences created for user: {}", savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to create default preferences for user: {}", savedUser.getId(), e);
            // Don't fail registration if preferences creation fails
        }

        // Create onboarding progress for the new user
        try {
            onboardingService.createProgressRecord(savedUser.getId());
            log.info("Onboarding progress record created for user: {}", savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to create onboarding progress for user: {}", savedUser.getId(), e);
            // Don't fail registration if onboarding creation fails
        }

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
            log.info("Welcome email triggered for user: {}", savedUser.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to user: {}", savedUser.getEmail(), e);
            // Don't fail registration if email sending fails
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

            // Get user roles
            List<String> userRoles = roleService.getUserRoleNames(user.getId());

            // Generate JWT token with roles
            String token = jwtUtil.generateTokenWithRoles(user.getId(), user.getEmail(), userRoles);

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
                    .roles(userRoles)
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
    public UserResponse updateExtendedProfile(Long userId, com.myfinance.dto.request.ExtendedProfileRequest request) {
        log.info("Updating extended profile for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().trim());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        User updatedUser = userRepository.save(user);
        log.info("Extended profile updated successfully for user ID: {}", userId);

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

        // Send password change notification email
        try {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String changeTime = LocalDateTime.now().format(formatter);
            emailService.sendPasswordChangeEmail(user.getId(), user.getEmail(), user.getFullName(), changeTime);
            log.info("Password change notification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password change email to: {}", user.getEmail(), e);
            // Don't fail password change if email fails
        }

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

        // Generate reset token
        String resetToken = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("Password reset token generated for user: {}", user.getEmail());

        // Send password reset email
        try {
            emailService.sendPasswordResetEmail(user.getId(), user.getEmail(), user.getFullName(), resetToken);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
            // Continue even if email fails - user can try again
        }
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

    /**
     * Create default admin user for system initialization
     */
    @Transactional
    public void createDefaultAdminUser() {
        String defaultEmail = "admin@myfinance.com";
        String defaultPassword = "admin123";
        String defaultFullName = "System Administrator";

        try {
            // Check if admin user already exists
            if (userRepository.existsByEmail(defaultEmail)) {
                log.info("Default admin user already exists: {}", defaultEmail);
                return;
            }

            log.info("Creating default admin user: {}", defaultEmail);

            // Create admin user
            User adminUser = new User();
            adminUser.setEmail(defaultEmail);
            adminUser.setPassword(passwordEncoder.encode(defaultPassword));
            adminUser.setFullName(defaultFullName);
            adminUser.setIsActive(true);
            adminUser.setIsEmailVerified(true); // Admin user is pre-verified
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(adminUser);
            log.info("Default admin user created with ID: {}", savedUser.getId());

            // Assign ADMIN role
            try {
                roleService.assignRole(savedUser.getId(), com.myfinance.entity.RoleName.ADMIN, null);
                log.info("ADMIN role assigned to default admin user");
            } catch (Exception e) {
                log.error("Failed to assign ADMIN role to default admin user", e);
            }

            // Create default categories for admin user
            try {
                categoryService.createDefaultCategoriesForUser(savedUser.getId());
                log.info("Default categories created for admin user");
            } catch (Exception e) {
                log.error("Failed to create default categories for admin user", e);
            }

            log.info("Default admin user setup completed successfully");

        } catch (Exception e) {
            log.error("Failed to create default admin user", e);
            // Don't fail application startup if admin creation fails
        }
    }

    private UserResponse mapToUserResponse(User user) {
        List<String> userRoles = roleService.getUserRoleNames(user.getId());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .avatar(user.getAvatar())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(userRoles)
                .build();
    }
}