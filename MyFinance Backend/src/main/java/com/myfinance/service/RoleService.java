package com.myfinance.service;

import com.myfinance.entity.Role;
import com.myfinance.entity.RoleName;
import com.myfinance.entity.UserRole;
import com.myfinance.repository.RoleRepository;
import com.myfinance.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    /**
     * Get all active roles
     */
    public List<Role> getAllActiveRoles() {
        return roleRepository.findByIsActiveTrue();
    }

    /**
     * Get role by name
     */
    public Optional<Role> getRoleByName(RoleName roleName) {
        return roleRepository.findByRoleName(roleName);
    }

    /**
     * Get user roles by user ID
     */
    public List<Role> getUserRoles(Long userId) {
        return userRoleRepository.findActiveRolesByUserId(userId);
    }

    /**
     * Get user role names by user ID
     */
    public List<String> getUserRoleNames(Long userId) {
        return userRoleRepository.findActiveRoleNamesByUserId(userId)
                .stream()
                .map(RoleName::name)
                .collect(Collectors.toList());
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(Long userId, RoleName roleName) {
        return userRoleRepository.existsByUserIdAndRoleNameAndIsActiveTrue(userId, roleName);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(Long userId) {
        return hasRole(userId, RoleName.ADMIN) || hasRole(userId, RoleName.SUPER_ADMIN);
    }

    /**
     * Check if user is super admin
     */
    public boolean isSuperAdmin(Long userId) {
        return hasRole(userId, RoleName.SUPER_ADMIN);
    }

    /**
     * Assign role to user
     */
    @Transactional
    public UserRole assignRole(Long userId, RoleName roleName, Long assignedByUserId) {
        // Check if role exists
        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại: " + roleName));

        // Check if user already has this role
        Optional<UserRole> existingUserRole = userRoleRepository
                .findByUserIdAndRoleNameAndIsActiveTrue(userId, roleName);

        if (existingUserRole.isPresent()) {
            throw new RuntimeException("Người dùng đã có vai trò này");
        }

        // Create new user role
        UserRole userRole = new UserRole();
        userRole.setUserId(userId);
        userRole.setRole(role);
        userRole.setAssignedByUserId(assignedByUserId);
        userRole.setIsActive(true);

        return userRoleRepository.save(userRole);
    }

    /**
     * Remove role from user
     */
    @Transactional
    public void removeRole(Long userId, RoleName roleName) {
        Optional<UserRole> userRole = userRoleRepository
                .findByUserIdAndRoleNameAndIsActiveTrue(userId, roleName);

        if (userRole.isPresent()) {
            UserRole ur = userRole.get();
            ur.setIsActive(false);
            userRoleRepository.save(ur);
        }
    }

    /**
     * Initialize default roles
     */
    @Transactional
    public void initializeDefaultRoles() {
        for (RoleName roleName : RoleName.values()) {
            if (!roleRepository.existsByRoleName(roleName)) {
                Role role = new Role();
                role.setRoleName(roleName);
                role.setDescription(roleName.getDescription());
                role.setIsActive(true);
                roleRepository.save(role);
                log.info("Created default role: {}", roleName);
            }
        }
    }

    /**
     * Assign default USER role to new user
     */
    @Transactional
    public void assignDefaultUserRole(Long userId) {
        try {
            assignRole(userId, RoleName.USER, null);
            log.info("Assigned default USER role to user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to assign default role to user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Get users count by role
     */
    public long getUserCountByRole(RoleName roleName) {
        return userRoleRepository.countActiveUsersByRole(roleName);
    }

    /**
     * Get all admin user IDs
     */
    public List<Long> getAdminUserIds() {
        List<Long> adminIds = userRoleRepository.findActiveUserIdsByRole(RoleName.ADMIN);
        List<Long> superAdminIds = userRoleRepository.findActiveUserIdsByRole(RoleName.SUPER_ADMIN);

        adminIds.addAll(superAdminIds);
        return adminIds.stream().distinct().collect(Collectors.toList());
    }
}