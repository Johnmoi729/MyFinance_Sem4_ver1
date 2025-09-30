package com.myfinance.controller;

import com.myfinance.dto.request.BudgetRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.BudgetResponse;
import com.myfinance.dto.response.BudgetUsageResponse;
import com.myfinance.dto.response.BudgetWarningResponse;
import com.myfinance.dto.response.BudgetPerformanceResponse;
import com.myfinance.dto.response.BudgetDashboardResponse;
import com.myfinance.entity.TransactionType;
import com.myfinance.service.BudgetService;
import com.myfinance.util.JwtUtil;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@Slf4j
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtUtil jwtUtil;

    @PostConstruct
    public void init() {
        log.info("BudgetController initialized successfully!");
        log.info("Budget endpoints registered at: /api/budgets");
    }

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testEndpoint() {
        log.info("Test endpoint called!");
        return ResponseEntity.ok(ApiResponse.success("BudgetController is working!"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @Valid @RequestBody BudgetRequest request,
            @RequestHeader("Authorization") String authHeader) {

        log.info("POST /api/budgets called with request: {}", request);
        Long userId = extractUserIdFromToken(authHeader);
        BudgetResponse response = budgetService.createBudget(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ngân sách đã được tạo thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudget(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        BudgetResponse response = budgetService.getBudgetById(id, userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getUserBudgets(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Long categoryId) {

        log.info("GET /api/budgets called with params - type: {}, year: {}, month: {}, categoryId: {}", type, year, month, categoryId);
        Long userId = extractUserIdFromToken(authHeader);
        List<BudgetResponse> budgets;

        if (year != null && month != null) {
            // Get budgets for specific period (year + month)
            budgets = budgetService.getBudgetsForPeriod(userId, year, month);
        } else if (year != null) {
            // Get budgets for specific year only
            budgets = budgetService.getBudgetsForYear(userId, year);
        } else if (categoryId != null) {
            // Get budgets for specific category
            budgets = budgetService.getBudgetsByCategory(userId, categoryId);
        } else if (type != null && !type.isEmpty()) {
            // Get budgets by category type (keeping for backward compatibility)
            TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
            budgets = budgetService.getBudgetsByType(userId, transactionType);
        } else {
            // Get all user budgets
            budgets = budgetService.getUserBudgets(userId);
        }

        // Apply client-side filtering for combinations not supported by repository methods
        if (budgets != null && categoryId != null && (year != null || month != null)) {
            budgets = budgets.stream()
                .filter(budget -> budget.getCategory().getId().equals(categoryId))
                .collect(Collectors.toList());
        }

        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getCurrentMonthBudgets(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        List<BudgetResponse> budgets = budgetService.getCurrentMonthBudgets(userId);

        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @GetMapping("/period/{year}/{month}")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsForPeriod(
            @PathVariable Integer year,
            @PathVariable Integer month,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        List<BudgetResponse> budgets = budgetService.getBudgetsForPeriod(userId, year, month);

        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        BudgetResponse response = budgetService.updateBudget(id, request, userId);

        return ResponseEntity.ok(ApiResponse.success("Ngân sách đã được cập nhật thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        budgetService.deleteBudget(id, userId);

        return ResponseEntity.ok(ApiResponse.success("Ngân sách đã được xóa thành công", null));
    }

    // ===== BUDGET ANALYTICS ENDPOINTS =====

    @GetMapping("/analytics/usage")
    public ResponseEntity<ApiResponse<List<BudgetUsageResponse>>> getBudgetUsageAnalytics(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budgets/analytics/usage called");
        Long userId = extractUserIdFromToken(authHeader);
        List<BudgetUsageResponse> usage = budgetService.getBudgetUsageAnalytics(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải thống kê sử dụng ngân sách", usage));
    }

    @GetMapping("/analytics/usage/current")
    public ResponseEntity<ApiResponse<List<BudgetUsageResponse>>> getCurrentMonthBudgetUsage(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budgets/analytics/usage/current called");
        Long userId = extractUserIdFromToken(authHeader);
        List<BudgetUsageResponse> usage = budgetService.getCurrentMonthBudgetUsage(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải thống kê sử dụng ngân sách tháng hiện tại", usage));
    }

    @GetMapping("/analytics/warnings")
    public ResponseEntity<ApiResponse<BudgetWarningResponse>> getBudgetWarnings(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budgets/analytics/warnings called");
        Long userId = extractUserIdFromToken(authHeader);
        BudgetWarningResponse warnings = budgetService.getBudgetWarnings(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải cảnh báo ngân sách", warnings));
    }

    @GetMapping("/analytics/performance")
    public ResponseEntity<ApiResponse<BudgetPerformanceResponse>> getBudgetPerformance(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budgets/analytics/performance called");
        Long userId = extractUserIdFromToken(authHeader);
        BudgetPerformanceResponse performance = budgetService.getBudgetPerformance(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải hiệu suất ngân sách", performance));
    }

    @GetMapping("/analytics/dashboard")
    public ResponseEntity<ApiResponse<BudgetDashboardResponse>> getBudgetDashboard(
            @RequestHeader("Authorization") String authHeader) {

        log.info("GET /api/budgets/analytics/dashboard called");
        Long userId = extractUserIdFromToken(authHeader);
        BudgetDashboardResponse dashboard = budgetService.getBudgetDashboard(userId);

        return ResponseEntity.ok(ApiResponse.success("Đã tải tổng quan ngân sách", dashboard));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}