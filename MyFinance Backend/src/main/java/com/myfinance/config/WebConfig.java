package com.myfinance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Old configuration (specific ports only):
        // .allowedOriginPatterns("http://localhost:3000", "http://localhost:3001", "https://*.vercel.app", "https://*.netlify.app")

        // New configuration (allows Flutter Web dynamic ports + React):
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                    "http://localhost:*",      // Allow any localhost port (Flutter Web + React)
                    "http://127.0.0.1:*",      // Allow loopback with any port
                    "https://*.vercel.app",    // Vercel deployments
                    "https://*.netlify.app"    // Netlify deployments
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}