package com.myfinance.repository;

import com.myfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);

    // Find active users
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    Optional<User> findActiveByEmail(String email);

    // Update last login time
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLogin = :lastLogin WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("lastLogin") LocalDateTime lastLogin);

    // Count active users
    long countByIsActiveTrue();

    // Find users by full name containing (for search functionality)
    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:name% AND u.isActive = true")
    Optional<User> findByFullNameContainingIgnoreCase(@Param("name") String name);

    // Admin functionality methods
    Long countByIsActive(Boolean isActive);

    Long countByCreatedAtGreaterThanEqual(LocalDateTime date);

    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByLastLoginIsNotNull();

    Long countByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate);
}