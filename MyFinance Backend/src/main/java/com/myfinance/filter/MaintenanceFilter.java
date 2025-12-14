package com.myfinance.filter;

import com.myfinance.service.SystemConfigService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Maintenance Mode Filter
 *
 * Checks if system is in maintenance mode and blocks all non-admin requests.
 * This filter runs BEFORE JwtRequestFilter to block requests early.
 *
 * Admin endpoints are always allowed to enable/disable maintenance mode.
 */
@Component
@Order(1) // Run before JWT filter (which is added at UsernamePasswordAuthenticationFilter position)
@RequiredArgsConstructor
@Slf4j
public class MaintenanceFilter implements Filter {

    private final SystemConfigService systemConfigService;
    private final ObjectMapper objectMapper;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        // Always allow OPTIONS requests (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // Always allow admin endpoints (so admins can disable maintenance mode)
        if (path.startsWith("/api/admin")) {
            chain.doFilter(request, response);
            return;
        }

        // Always allow login endpoint (so admins can log in during maintenance)
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            chain.doFilter(request, response);
            return;
        }

        // Always allow health check
        if (path.equals("/actuator/health")) {
            chain.doFilter(request, response);
            return;
        }

        // Check maintenance mode
        boolean isMaintenanceMode = systemConfigService.isMaintenanceMode();

        if (isMaintenanceMode) {
            // Block request with 503 Service Unavailable
            httpResponse.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            httpResponse.setContentType("application/json");
            httpResponse.setCharacterEncoding("UTF-8");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Hệ thống đang bảo trì. Vui lòng quay lại sau.");
            errorResponse.put("code", "MAINTENANCE_MODE");
            errorResponse.put("timestamp", System.currentTimeMillis());

            String jsonResponse = objectMapper.writeValueAsString(errorResponse);
            httpResponse.getWriter().write(jsonResponse);

            log.warn("Maintenance mode: Blocked request to {} from {}",
                    path, httpRequest.getRemoteAddr());
            return;
        }

        // Allow request to proceed
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("MaintenanceFilter initialized");
    }

    @Override
    public void destroy() {
        log.info("MaintenanceFilter destroyed");
    }
}
