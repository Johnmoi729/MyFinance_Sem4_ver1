package com.myfinance.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    @Column(name = "current_step")
    private Integer currentStep = 1;

    @Column(name = "steps_completed")
    private Integer stepsCompleted = 0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "is_skipped")
    private Boolean isSkipped = false;

    // Track individual step completion
    @Column(name = "step1_completed") // Profile setup
    private Boolean step1Completed = false;

    @Column(name = "step2_completed") // First transaction
    private Boolean step2Completed = false;

    @Column(name = "step3_completed") // First budget
    private Boolean step3Completed = false;

    @Column(name = "step4_completed") // View report
    private Boolean step4Completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Check if onboarding should be shown (not completed and not skipped)
     */
    public boolean shouldShowOnboarding() {
        return !isCompleted && !isSkipped;
    }

    /**
     * Calculate progress percentage
     */
    public double getProgressPercentage() {
        int totalSteps = 4;
        return (stepsCompleted * 100.0) / totalSteps;
    }

    /**
     * Mark step as completed and update progress
     */
    public void completeStep(int stepNumber) {
        switch (stepNumber) {
            case 1:
                if (!step1Completed) {
                    step1Completed = true;
                    stepsCompleted++;
                }
                break;
            case 2:
                if (!step2Completed) {
                    step2Completed = true;
                    stepsCompleted++;
                }
                break;
            case 3:
                if (!step3Completed) {
                    step3Completed = true;
                    stepsCompleted++;
                }
                break;
            case 4:
                if (!step4Completed) {
                    step4Completed = true;
                    stepsCompleted++;
                }
                break;
        }

        // Update current step to next incomplete step
        updateCurrentStep();

        // Check if all steps are complete
        if (stepsCompleted >= 4) {
            isCompleted = true;
            completedAt = LocalDateTime.now();
        }
    }

    /**
     * Update current step to the next incomplete step
     */
    private void updateCurrentStep() {
        if (!step1Completed) {
            currentStep = 1;
        } else if (!step2Completed) {
            currentStep = 2;
        } else if (!step3Completed) {
            currentStep = 3;
        } else if (!step4Completed) {
            currentStep = 4;
        } else {
            currentStep = 4; // All complete
        }
    }
}
