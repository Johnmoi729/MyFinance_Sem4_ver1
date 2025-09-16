package com.myfinance.controller;

import com.myfinance.dto.request.CategoryRequest;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.entity.TransactionType;
import com.myfinance.service.CategoryService;
import com.myfinance.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        CategoryResponse response = categoryService.createCategory(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Danh mục đã được tạo thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        CategoryResponse response = categoryService.getCategoryById(id, userId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getUserCategories(
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        CategoryResponse response = categoryService.updateCategory(id, request, userId);

        return ResponseEntity.ok(ApiResponse.success("Danh mục đã được cập nhật thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        categoryService.deleteCategory(id, userId);

        return ResponseEntity.ok(ApiResponse.success("Danh mục đã được xóa thành công", null));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}