package com.myfinance.security;

import com.myfinance.service.AuditService;
import com.myfinance.service.RoleService;
import com.myfinance.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAuthorizationAspect {

    private final JwtUtil jwtUtil;
    private final RoleService roleService;
    private final AuditService auditService;

    @Around("@annotation(com.myfinance.security.RequiresAdmin) || @within(com.myfinance.security.RequiresAdmin)")
    public Object checkAdminAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new SecurityException("Không thể truy cập thông tin request");
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logUnauthorizedAccess("NO_TOKEN", ipAddress, userAgent, joinPoint.getSignature().getName());
            throw new SecurityException("Token không hợp lệ");
        }

        String token = authHeader.replace("Bearer ", "");

        try {
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                logUnauthorizedAccess("INVALID_TOKEN", ipAddress, userAgent, joinPoint.getSignature().getName());
                throw new SecurityException("Token không hợp lệ hoặc đã hết hạn");
            }

            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                logUnauthorizedAccess("NO_USER_ID", ipAddress, userAgent, joinPoint.getSignature().getName());
                throw new SecurityException("Không thể xác định người dùng");
            }

            // Check admin role
            if (!roleService.isAdmin(userId)) {
                logUnauthorizedAccess("NOT_ADMIN", ipAddress, userAgent, joinPoint.getSignature().getName());
                auditService.logSimpleAction("ACCESS_DENIED", "ADMIN_ENDPOINT",
                                            joinPoint.getSignature().getName(), null, userId, ipAddress);
                throw new SecurityException("Không có quyền truy cập");
            }

            // No logging for successful admin access - actions themselves are logged by controllers
            // This prevents log clutter (every admin page view would create a log entry)

            // Proceed with the method execution
            return joinPoint.proceed();

        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error in admin authorization aspect: {}", e.getMessage());
            throw new SecurityException("Lỗi kiểm tra quyền truy cập");
        }
    }

    private void logUnauthorizedAccess(String reason, String ipAddress, String userAgent, String endpoint) {
        log.warn("Unauthorized admin access attempt: {} from {} to {}", reason, ipAddress, endpoint);
        auditService.logSimpleAction("UNAUTHORIZED_ACCESS", "ADMIN_ENDPOINT", endpoint, null, null, ipAddress);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}