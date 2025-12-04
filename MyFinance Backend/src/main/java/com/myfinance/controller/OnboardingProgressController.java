package com.myfinance.controller;

import com.myfinance.dto.request.CompleteStepRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.OnboardingProgressResponse;
import com.myfinance.entity.OnboardingProgress;
import com.myfinance.service.OnboardingProgressService;
import com.myfinance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingProgressController {

    private final OnboardingProgressService onboardingService;
    private final JwtUtil jwtUtil;

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<OnboardingProgressResponse>> getProgress(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        OnboardingProgress progress = onboardingService.getProgress(userId);
        OnboardingProgressResponse response = mapToResponse(progress);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/complete-step")
    public ResponseEntity<ApiResponse<OnboardingProgressResponse>> completeStep(
            @Valid @RequestBody CompleteStepRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        OnboardingProgress progress = onboardingService.completeStep(userId, request.getStepNumber());
        OnboardingProgressResponse response = mapToResponse(progress);

        return ResponseEntity.ok(ApiResponse.success("Bước " + request.getStepNumber() + " đã hoàn thành", response));
    }

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<OnboardingProgressResponse>> completeOnboarding(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        OnboardingProgress progress = onboardingService.completeOnboarding(userId);
        OnboardingProgressResponse response = mapToResponse(progress);

        return ResponseEntity.ok(ApiResponse.success("Hoàn thành hướng dẫn! Chào mừng đến với MyFinance!", response));
    }

    @PostMapping("/skip")
    public ResponseEntity<ApiResponse<OnboardingProgressResponse>> skipOnboarding(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        OnboardingProgress progress = onboardingService.skipOnboarding(userId);
        OnboardingProgressResponse response = mapToResponse(progress);

        return ResponseEntity.ok(ApiResponse.success("Đã bỏ qua hướng dẫn", response));
    }

    @PostMapping("/restart")
    public ResponseEntity<ApiResponse<OnboardingProgressResponse>> restartOnboarding(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        OnboardingProgress progress = onboardingService.restartOnboarding(userId);
        OnboardingProgressResponse response = mapToResponse(progress);

        return ResponseEntity.ok(ApiResponse.success("Đã khởi động lại hướng dẫn", response));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    private OnboardingProgressResponse mapToResponse(OnboardingProgress progress) {
        return OnboardingProgressResponse.builder()
                .id(progress.getId())
                .userId(progress.getUserId())
                .currentStep(progress.getCurrentStep())
                .stepsCompleted(progress.getStepsCompleted())
                .isCompleted(progress.getIsCompleted())
                .isSkipped(progress.getIsSkipped())
                .shouldShowOnboarding(progress.shouldShowOnboarding())
                .progressPercentage(progress.getProgressPercentage())
                .step1Completed(progress.getStep1Completed())
                .step2Completed(progress.getStep2Completed())
                .step3Completed(progress.getStep3Completed())
                .step4Completed(progress.getStep4Completed())
                .completedAt(progress.getCompletedAt())
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}
