package com.myfinance.controller;

import com.myfinance.dto.request.TransactionRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.TransactionResponse;
import com.myfinance.dto.response.TransactionStatsResponse;
import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.entity.TransactionType;
import com.myfinance.service.TransactionService;
import com.myfinance.service.CategoryService;
import com.myfinance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<TransactionResponse>> addTransaction(
            @Valid @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.createTransaction(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Giao dịch đã được thêm thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.getTransactionById(id, userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getUserTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type) {

        Long userId = extractUserIdFromToken(authHeader);
        List<TransactionResponse> transactions;

        if (type != null && !type.isEmpty()) {
            TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
            transactions = transactionService.getUserTransactionsByType(userId, transactionType);
        } else {
            transactions = transactionService.getUserTransactions(userId);
        }

        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> searchTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String searchTerm) {

        Long userId = extractUserIdFromToken(authHeader);
        List<TransactionResponse> transactions = transactionService.searchTransactions(userId, searchTerm);

        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsWithFilters(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String searchTerm) {

        Long userId = extractUserIdFromToken(authHeader);
        
        TransactionType transactionType = null;
        if (type != null && !type.isEmpty()) {
            transactionType = TransactionType.valueOf(type.toUpperCase());
        }
        
        LocalDate start = null;
        if (startDate != null && !startDate.isEmpty()) {
            start = LocalDate.parse(startDate);
        }
        
        LocalDate end = null;
        if (endDate != null && !endDate.isEmpty()) {
            end = LocalDate.parse(endDate);
        }
        
        List<TransactionResponse> transactions = transactionService.getTransactionsWithFilters(
                userId, transactionType, categoryId, start, end, searchTerm);

        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getRecentTransactions(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        List<TransactionResponse> transactions = transactionService.getRecentTransactions(userId);

        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<TransactionStatsResponse>> getTransactionStats(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        TransactionStatsResponse stats = transactionService.getUserTransactionStats(userId);

        return ResponseEntity.ok(ApiResponse.success("Thống kê giao dịch", stats));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.updateTransaction(id, request, userId);

        return ResponseEntity.ok(ApiResponse.success("Giao dịch đã được cập nhật thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        transactionService.deleteTransaction(id, userId);

        return ResponseEntity.ok(ApiResponse.success("Giao dịch đã được xóa thành công", null));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type) {

        Long userId = extractUserIdFromToken(authHeader);
        List<CategoryResponse> categories;

        if (type != null && !type.isEmpty()) {
            TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
            categories = categoryService.getUserCategoriesByType(userId, transactionType);
        } else {
            categories = categoryService.getUserCategories(userId);
        }

        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}