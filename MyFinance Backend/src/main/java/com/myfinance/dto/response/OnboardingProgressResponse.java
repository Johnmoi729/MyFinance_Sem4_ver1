package com.myfinance.dto.response;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class OnboardingProgressResponse {
    private Long id;
    private Long userId;
    private Integer currentStep;
    private Integer stepsCompleted;
    private Boolean isCompleted;
    private Boolean isSkipped;
    private Boolean shouldShowOnboarding;
    private Double progressPercentage;

    // Individual step completion status
    private Boolean step1Completed;
    private Boolean step2Completed;
    private Boolean step3Completed;
    private Boolean step4Completed;

    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
