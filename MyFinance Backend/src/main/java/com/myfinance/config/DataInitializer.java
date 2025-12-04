package com.myfinance.config;

import com.myfinance.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CurrencyService currencyService;

    @Override
    public void run(String... args) {
        try {
            log.info("Initializing application data...");
            currencyService.initializeDefaultCurrencies();
            log.info("Application data initialized successfully");
        } catch (Exception e) {
            log.error("Error initializing application data", e);
        }
    }
}
