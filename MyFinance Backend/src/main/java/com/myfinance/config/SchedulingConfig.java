package com.myfinance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Spring Scheduling configuration
    // @Scheduled methods will now run automatically
}
