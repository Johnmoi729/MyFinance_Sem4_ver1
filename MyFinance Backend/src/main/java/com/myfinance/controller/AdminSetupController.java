package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.entity.Role;
import com.myfinance.entity.RoleName;
import com.myfinance.entity.User;
import com.myfinance.entity.UserRole;
import com.myfinance.repository.RoleRepository;
import com.myfinance.repository.UserRepository;
import com.myfinance.repository.UserRoleRepository;
import com.myfinance.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/setup")
@RequiredArgsConstructor
@Slf4j
public class AdminSetupController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<String>> createAdminUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "ADMIN") String roleType,
            HttpServletRequest request) {

        try {
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email đã tồn tại trong hệ thống"));
            }

            // Validate role type
            RoleName roleName;
            try {
                roleName = RoleName.valueOf(roleType);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Loại role không hợp lệ. Sử dụng: USER, ADMIN, SUPER_ADMIN"));
            }

            // Create user
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setIsActive(true);
            user.setIsEmailVerified(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);

            // Assign role
            Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại: " + roleName));

            UserRole userRole = new UserRole();
            userRole.setUserId(savedUser.getId());
            userRole.setRole(role);
            userRole.setAssignedByUserId(null);
            userRole.setIsActive(true);

            userRoleRepository.save(userRole);

            // Log admin creation
            auditService.logAdminAction(
                "SYSTEM",
                "ADMIN_USER_CREATE",
                "User",
                savedUser.getId(),
                "Tạo tài khoản admin: " + email + " với role " + roleType,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            log.info("Admin user created successfully: {} with role {}", email, roleType);

            return ResponseEntity.ok(ApiResponse.success(
                "Tạo tài khoản admin thành công",
                "Admin user created: " + email
            ));

        } catch (Exception e) {
            log.error("Error creating admin user", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi tạo tài khoản admin"));
        }
    }

    @PostMapping("/promote-user/{userId}")
    public ResponseEntity<ApiResponse<String>> promoteUserToAdmin(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "ADMIN") String roleType,
            HttpServletRequest request) {

        try {
            // Find user
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Validate role type
            RoleName roleName;
            try {
                roleName = RoleName.valueOf(roleType);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Loại role không hợp lệ"));
            }

            // Check if user already has this role
            Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

            boolean hasRole = userRoleRepository.existsByUserIdAndRoleNameAndIsActiveTrue(user.getId(), roleName);
            if (hasRole) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Người dùng đã có role này"));
            }

            // Assign new role
            UserRole userRole = new UserRole();
            userRole.setUserId(user.getId());
            userRole.setRole(role);
            userRole.setAssignedByUserId(null);
            userRole.setIsActive(true);

            userRoleRepository.save(userRole);

            // Log promotion
            auditService.logAdminAction(
                "SYSTEM",
                "USER_ROLE_PROMOTE",
                "User",
                userId,
                "Nâng cấp người dùng " + user.getEmail() + " lên role " + roleType,
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
            );

            log.info("User promoted successfully: {} to {}", user.getEmail(), roleType);

            return ResponseEntity.ok(ApiResponse.success(
                "Nâng cấp quyền người dùng thành công",
                "User promoted: " + user.getEmail()
            ));

        } catch (Exception e) {
            log.error("Error promoting user to admin", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi nâng cấp quyền"));
        }
    }

    @GetMapping("/check-admin-exists")
    public ResponseEntity<ApiResponse<Boolean>> checkAdminExists() {
        try {
            // Check if any admin users exist
            Role adminRole = roleRepository.findByRoleName(RoleName.ADMIN)
                .orElse(null);
            Role superAdminRole = roleRepository.findByRoleName(RoleName.SUPER_ADMIN)
                .orElse(null);

            boolean adminExists = false;
            if (adminRole != null) {
                adminExists = userRoleRepository.countActiveUsersByRole(RoleName.ADMIN) > 0;
            }
            if (!adminExists && superAdminRole != null) {
                adminExists = userRoleRepository.countActiveUsersByRole(RoleName.SUPER_ADMIN) > 0;
            }

            return ResponseEntity.ok(ApiResponse.success(
                adminExists ? "Tài khoản admin đã tồn tại" : "Chưa có tài khoản admin", adminExists));

        } catch (Exception e) {
            log.error("Error checking admin existence", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống"));
        }
    }
}