package com.myfinance.repository;

import com.myfinance.entity.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {

    // Find preferences by user ID
    Optional<UserPreferences> findByUserId(Long userId);

    // Check if user has preferences
    boolean existsByUserId(Long userId);

    // Delete by user ID (for cleanup)
    void deleteByUserId(Long userId);
}
