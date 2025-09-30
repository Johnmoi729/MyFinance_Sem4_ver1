package com.myfinance.service;

import com.myfinance.dto.response.AdminUserResponse;
import com.myfinance.entity.Role;
import com.myfinance.entity.User;
import com.myfinance.entity.UserRole;
import com.myfinance.repository.UserRepository;
import com.myfinance.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final TransactionService transactionService;
    private final BudgetService budgetService;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getAllUsersForAdmin(Pageable pageable, String search, Boolean isActive) {
        Specification<User> spec = createUserSpecification(search, isActive);
        Page<User> users = userRepository.findAll(spec, pageable);

        return users.map(this::convertToAdminUserResponse);
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUserByIdForAdmin(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        return convertToAdminUserResponse(user);
    }

    @Transactional(readOnly = true)
    public String getUserStatus(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        return user.getIsActive() ? "ACTIVE" : "INACTIVE";
    }

    @Transactional
    public void updateUserStatus(Long userId, Boolean isActive, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        user.setIsActive(isActive);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Cập nhật trạng thái người dùng {} thành {}: {}",
                 user.getEmail(), isActive ? "ACTIVE" : "INACTIVE", reason);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // Total users
        Long totalUsers = userRepository.count();
        statistics.put("totalUsers", totalUsers);

        // Active users
        Long activeUsers = userRepository.countByIsActive(true);
        statistics.put("activeUsers", activeUsers);

        // Inactive users
        Long inactiveUsers = totalUsers - activeUsers;
        statistics.put("inactiveUsers", inactiveUsers);

        // New users today
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Long newUsersToday = userRepository.countByCreatedAtGreaterThanEqual(startOfDay);
        statistics.put("newUsersToday", newUsersToday);

        // New users this month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Long newUsersThisMonth = userRepository.countByCreatedAtGreaterThanEqual(startOfMonth);
        statistics.put("newUsersThisMonth", newUsersThisMonth);

        // Calculate growth percentage (compared to previous month)
        LocalDateTime startOfPrevMonth = startOfMonth.minusMonths(1);
        Long newUsersPrevMonth = userRepository.countByCreatedAtBetween(startOfPrevMonth, startOfMonth);

        Double growthPercentage = 0.0;
        if (newUsersPrevMonth > 0) {
            growthPercentage = ((double) (newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100;
        } else if (newUsersThisMonth > 0) {
            growthPercentage = 100.0;
        }
        statistics.put("growthPercentage", Math.round(growthPercentage * 100.0) / 100.0);

        // User activity statistics
        statistics.put("lastLoginCount", userRepository.countByLastLoginIsNotNull());

        return statistics;
    }

    private Specification<User> createUserSpecification(String search, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate emailPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate namePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fullName")), searchPattern);

                predicates.add(criteriaBuilder.or(emailPredicate, namePredicate));
            }

            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private AdminUserResponse convertToAdminUserResponse(User user) {
        // Get user roles
        List<UserRole> userRoles = userRoleRepository.findByUserId(user.getId());
        List<String> roles = userRoles.stream()
            .map(ur -> ur.getRole().getRoleName().name())
            .collect(Collectors.toList());

        // Get user statistics
        Long totalTransactions = transactionService.countByUserId(user.getId());
        Long totalBudgets = budgetService.countByUserId(user.getId());
        Long totalCategories = categoryService.countByUserId(user.getId());

        return AdminUserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .phoneNumber(user.getPhoneNumber())
            .isActive(user.getIsActive())
            .isEmailVerified(user.getIsEmailVerified())
            .lastLogin(user.getLastLogin())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .totalTransactions(totalTransactions)
            .totalBudgets(totalBudgets)
            .totalCategories(totalCategories)
            .roles(roles)
            .loginCount(user.getLoginCount() != null ? user.getLoginCount() : 0L)
            .lastActivity(user.getLastLogin())
            .build();
    }
}