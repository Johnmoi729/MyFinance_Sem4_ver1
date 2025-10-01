package com.myfinance.controller;

import com.myfinance.dto.request.AdminUserStatusRequest;
import com.myfinance.dto.response.AdminUserResponse;
import com.myfinance.dto.response.ApiResponse;
import com.myfinance.security.RequiresAdmin;
import com.myfinance.service.AuditService;
import com.myfinance.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Slf4j
@RequiresAdmin
public class AdminUserController {

    private final UserService userService;
    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<AdminUserResponse> users = userService.getAllUsersForAdmin(pageable, search, isActive);

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", users));
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách người dùng", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy danh sách người dùng"));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUserById(
            @PathVariable Long userId,
            Authentication authentication,
            HttpServletRequest request) {

        try {
            AdminUserResponse user = userService.getUserByIdForAdmin(userId);

            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin người dùng thành công", user));
        } catch (RuntimeException e) {
            log.error("Lỗi khi lấy thông tin người dùng với ID: {}", userId, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi lấy thông tin người dùng", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy thông tin người dùng"));
        }
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<String>> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserStatusRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        try {
            String oldStatus = userService.getUserStatus(userId);
            userService.updateUserStatus(userId, request.getIsActive(), request.getReason());

            String action = request.getIsActive() ? "USER_ACTIVATE" : "USER_DEACTIVATE";
            String description = request.getIsActive()
                ? "Kích hoạt tài khoản người dùng"
                : "Vô hiệu hóa tài khoản người dùng";

            auditService.logAdminAction(
                authentication.getName(),
                action,
                "User",
                userId,
                description + (request.getReason() != null ? ": " + request.getReason() : ""),
                oldStatus,
                request.getIsActive().toString(),
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent")
            );

            String message = request.getIsActive()
                ? "Kích hoạt tài khoản người dùng thành công"
                : "Vô hiệu hóa tài khoản người dùng thành công";

            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (RuntimeException e) {
            log.error("Lỗi khi cập nhật trạng thái người dùng với ID: {}", userId, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi cập nhật trạng thái người dùng", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi cập nhật trạng thái người dùng"));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getUserStatistics(
            Authentication authentication,
            HttpServletRequest request) {

        try {
            Object statistics = userService.getUserStatistics();

            return ResponseEntity.ok(ApiResponse.success("Lấy thống kê người dùng thành công", statistics));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê người dùng", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Lỗi hệ thống khi lấy thống kê người dùng"));
        }
    }
}