package com.myfinance.repository;

import com.myfinance.entity.OnboardingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OnboardingProgressRepository extends JpaRepository<OnboardingProgress, Long> {

    // Find onboarding progress by user ID
    Optional<OnboardingProgress> findByUserId(Long userId);

    // Check if user has onboarding record
    boolean existsByUserId(Long userId);

    // Find users who haven't completed onboarding
    @Query("SELECT op FROM OnboardingProgress op WHERE op.isCompleted = false AND op.isSkipped = false")
    java.util.List<OnboardingProgress> findIncompleteOnboarding();

    // Count completed onboarding
    long countByIsCompletedTrue();

    // Count skipped onboarding
    long countByIsSkippedTrue();

    // Delete by user ID (for cleanup)
    void deleteByUserId(Long userId);
}
