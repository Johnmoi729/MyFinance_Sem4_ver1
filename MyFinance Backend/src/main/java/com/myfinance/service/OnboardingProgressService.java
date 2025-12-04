package com.myfinance.service;

import com.myfinance.entity.OnboardingProgress;
import com.myfinance.repository.OnboardingProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OnboardingProgressService {

    private final OnboardingProgressRepository progressRepository;

    /**
     * Get onboarding progress for a user
     * Creates new progress record if not exists
     */
    public OnboardingProgress getProgress(Long userId) {
        return progressRepository.findByUserId(userId)
                .orElseGet(() -> createProgressRecord(userId));
    }

    /**
     * Create new onboarding progress record for a user
     */
    @Transactional
    public OnboardingProgress createProgressRecord(Long userId) {
        log.info("Creating onboarding progress record for user: {}", userId);

        // Check if record already exists
        if (progressRepository.existsByUserId(userId)) {
            return progressRepository.findByUserId(userId).get();
        }

        OnboardingProgress progress = new OnboardingProgress();
        progress.setUserId(userId);
        progress.setCurrentStep(1);
        progress.setStepsCompleted(0);
        progress.setIsCompleted(false);
        progress.setIsSkipped(false);
        progress.setStep1Completed(false);
        progress.setStep2Completed(false);
        progress.setStep3Completed(false);
        progress.setStep4Completed(false);

        OnboardingProgress savedProgress = progressRepository.save(progress);
        log.info("Onboarding progress record created for user: {}", userId);

        return savedProgress;
    }

    /**
     * Complete a specific onboarding step
     */
    @Transactional
    public OnboardingProgress completeStep(Long userId, int stepNumber) {
        log.info("Completing onboarding step {} for user: {}", stepNumber, userId);

        OnboardingProgress progress = getProgress(userId);

        // If already completed or skipped, don't update
        if (progress.getIsCompleted() || progress.getIsSkipped()) {
            log.info("Onboarding already completed or skipped for user: {}", userId);
            return progress;
        }

        // Complete the step using entity method
        progress.completeStep(stepNumber);

        OnboardingProgress savedProgress = progressRepository.save(progress);
        log.info("Step {} completed for user: {}. Progress: {}%",
                stepNumber, userId, savedProgress.getProgressPercentage());

        return savedProgress;
    }

    /**
     * Skip onboarding
     */
    @Transactional
    public OnboardingProgress skipOnboarding(Long userId) {
        log.info("Skipping onboarding for user: {}", userId);

        OnboardingProgress progress = getProgress(userId);
        progress.setIsSkipped(true);
        progress.setIsCompleted(false);

        OnboardingProgress savedProgress = progressRepository.save(progress);
        log.info("Onboarding skipped for user: {}", userId);

        return savedProgress;
    }

    /**
     * Complete all onboarding
     */
    @Transactional
    public OnboardingProgress completeOnboarding(Long userId) {
        log.info("Completing onboarding for user: {}", userId);

        OnboardingProgress progress = getProgress(userId);

        // Mark all steps as completed
        progress.completeStep(1);
        progress.completeStep(2);
        progress.completeStep(3);
        progress.completeStep(4);

        progress.setIsCompleted(true);
        progress.setCompletedAt(java.time.LocalDateTime.now());

        OnboardingProgress savedProgress = progressRepository.save(progress);
        log.info("Onboarding completed for user: {}", userId);

        return savedProgress;
    }

    /**
     * Restart onboarding (reset progress)
     */
    @Transactional
    public OnboardingProgress restartOnboarding(Long userId) {
        log.info("Restarting onboarding for user: {}", userId);

        OnboardingProgress progress = getProgress(userId);

        progress.setCurrentStep(1);
        progress.setStepsCompleted(0);
        progress.setIsCompleted(false);
        progress.setIsSkipped(false);
        progress.setStep1Completed(false);
        progress.setStep2Completed(false);
        progress.setStep3Completed(false);
        progress.setStep4Completed(false);
        progress.setCompletedAt(null);

        OnboardingProgress savedProgress = progressRepository.save(progress);
        log.info("Onboarding restarted for user: {}", userId);

        return savedProgress;
    }

    /**
     * Check if onboarding should be shown
     */
    public boolean shouldShowOnboarding(Long userId) {
        OnboardingProgress progress = getProgress(userId);
        return progress.shouldShowOnboarding();
    }

    /**
     * Delete onboarding progress (for cleanup when user is deleted)
     */
    @Transactional
    public void deleteProgress(Long userId) {
        log.info("Deleting onboarding progress for user: {}", userId);
        progressRepository.deleteByUserId(userId);
    }

    /**
     * Get onboarding statistics (for admin dashboard)
     */
    public OnboardingStatistics getStatistics() {
        long totalUsers = progressRepository.count();
        long completedCount = progressRepository.countByIsCompletedTrue();
        long skippedCount = progressRepository.countByIsSkippedTrue();
        long inProgressCount = totalUsers - completedCount - skippedCount;

        double completionRate = totalUsers > 0 ? (completedCount * 100.0 / totalUsers) : 0;
        double skipRate = totalUsers > 0 ? (skippedCount * 100.0 / totalUsers) : 0;

        return new OnboardingStatistics(
                totalUsers,
                completedCount,
                skippedCount,
                inProgressCount,
                completionRate,
                skipRate
        );
    }

    /**
     * Inner class for onboarding statistics
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class OnboardingStatistics {
        private long totalUsers;
        private long completedCount;
        private long skippedCount;
        private long inProgressCount;
        private double completionRate;
        private double skipRate;
    }
}
