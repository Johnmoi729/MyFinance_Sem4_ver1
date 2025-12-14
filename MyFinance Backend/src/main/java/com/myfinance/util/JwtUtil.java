package com.myfinance.util;

import com.myfinance.service.SystemConfigService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    private final SystemConfigService systemConfigService;

    // Generate secret key
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract user ID from token
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // Extract roles from token
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> {
            Object roles = claims.get("roles");
            if (roles instanceof List) {
                return (List<String>) roles;
            }
            return new ArrayList<>();
        });
    }

    // Extract permissions from token
    @SuppressWarnings("unchecked")
    public List<String> extractPermissions(String token) {
        return extractClaim(token, claims -> {
            Object permissions = claims.get("permissions");
            if (permissions instanceof List) {
                return (List<String>) permissions;
            }
            return new ArrayList<>();
        });
    }

    // Check if token has specific role
    public Boolean hasRole(String token, String role) {
        try {
            List<String> roles = extractRoles(token);
            return roles.contains(role);
        } catch (JwtException e) {
            log.error("Error checking role: {}", e.getMessage());
            return false;
        }
    }

    // Check if token has specific permission
    public Boolean hasPermission(String token, String permission) {
        try {
            List<String> permissions = extractPermissions(token);
            return permissions.contains(permission);
        } catch (JwtException e) {
            log.error("Error checking permission: {}", e.getMessage());
            return false;
        }
    }

    // Extract expiration date from token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract a claim from token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims from token
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            log.error("JWT token is malformed: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            throw e;
        }
    }

    // Check if token is expired
    public Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // Generate token for user
    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return createToken(claims, username);
    }

    // Generate token with roles and permissions
    public String generateToken(Long userId, String username, List<String> roles, List<String> permissions) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", roles != null ? roles : new ArrayList<>());
        claims.put("permissions", permissions != null ? permissions : new ArrayList<>());
        return createToken(claims, username);
    }

    // Generate token with roles only
    public String generateTokenWithRoles(Long userId, String username, List<String> roles) {
        return generateToken(userId, username, roles, new ArrayList<>());
    }

    // Create token with claims
    private String createToken(Map<String, Object> claims, String subject) {
        // Read session timeout from config (hours), fallback to application.properties (24 hours)
        int sessionTimeoutHours = systemConfigService.getIntConfig("SESSION_TIMEOUT_HOURS", 24);
        long expirationMs = sessionTimeoutHours * 60L * 60L * 1000L; // Convert hours to milliseconds

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Validate token
    public Boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Validate token without username check
    public Boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Get remaining time until token expires
    public Long getTokenRemainingTime(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (JwtException e) {
            return 0L;
        }
    }

    // Refresh token (generate new token with same claims but extended expiration)
    public String refreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String username = claims.getSubject();
            Long userId = claims.get("userId", Long.class);

            return generateToken(userId, username);
        } catch (JwtException e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw e;
        }
    }
}