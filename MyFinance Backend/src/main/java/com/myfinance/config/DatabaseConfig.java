package com.myfinance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.myfinance.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // Additional database configuration if needed
}