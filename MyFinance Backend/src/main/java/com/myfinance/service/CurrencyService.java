package com.myfinance.service;

import com.myfinance.entity.Currency;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    /**
     * Get all active currencies
     */
    public List<Currency> getAllActiveCurrencies() {
        return currencyRepository.findByIsActiveTrueOrderByName();
    }

    /**
     * Get all currencies (active and inactive)
     */
    public List<Currency> getAllCurrencies() {
        return currencyRepository.findAllByOrderByName();
    }

    /**
     * Get currency by code
     */
    public Currency getCurrencyByCode(String code) {
        return currencyRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại tiền tệ: " + code));
    }

    /**
     * Get base currency (VND by default)
     */
    public Currency getBaseCurrency() {
        return currencyRepository.findByIsBaseCurrencyTrue()
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tiền tệ cơ bản"));
    }

    /**
     * Convert amount from one currency to another
     * Formula: amount * (toCurrency.exchangeRate / fromCurrency.exchangeRate)
     */
    public BigDecimal convertAmount(BigDecimal amount, String fromCurrencyCode, String toCurrencyCode) {
        if (fromCurrencyCode.equalsIgnoreCase(toCurrencyCode)) {
            return amount;
        }

        Currency fromCurrency = getCurrencyByCode(fromCurrencyCode);
        Currency toCurrency = getCurrencyByCode(toCurrencyCode);

        // Convert to base currency first, then to target currency
        // amount * (toCurrency.exchangeRate / fromCurrency.exchangeRate)
        BigDecimal conversionRate = toCurrency.getExchangeRate()
                .divide(fromCurrency.getExchangeRate(), 6, RoundingMode.HALF_UP);

        return amount.multiply(conversionRate).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Convert amount to base currency (VND)
     */
    public BigDecimal convertToBaseCurrency(BigDecimal amount, String currencyCode) {
        Currency baseCurrency = getBaseCurrency();
        return convertAmount(amount, currencyCode, baseCurrency.getCode());
    }

    /**
     * Initialize default currencies with current exchange rates
     * VND is the base currency with exchange rate = 1.0
     */
    @Transactional
    public void initializeDefaultCurrencies() {
        if (currencyRepository.count() > 0) {
            log.info("Currencies already initialized, skipping default currency creation");
            return;
        }

        log.info("Initializing default currencies...");

        // VND - Base currency
        createCurrency("VND", "Vietnamese Dong", "₫", BigDecimal.ONE, true, true);

        // Major currencies (approximate exchange rates as of Nov 2025)
        createCurrency("USD", "US Dollar", "$", new BigDecimal("25000"), false, true);
        createCurrency("EUR", "Euro", "€", new BigDecimal("27000"), false, true);
        createCurrency("GBP", "British Pound", "£", new BigDecimal("31000"), false, true);
        createCurrency("JPY", "Japanese Yen", "¥", new BigDecimal("165"), false, true);

        // Asian currencies
        createCurrency("CNY", "Chinese Yuan", "¥", new BigDecimal("3450"), false, true);
        createCurrency("KRW", "South Korean Won", "₩", new BigDecimal("18.5"), false, true);
        createCurrency("THB", "Thai Baht", "฿", new BigDecimal("715"), false, true);
        createCurrency("SGD", "Singapore Dollar", "S$", new BigDecimal("18500"), false, true);
        createCurrency("MYR", "Malaysian Ringgit", "RM", new BigDecimal("5600"), false, true);

        log.info("Default currencies initialized successfully");
    }

    /**
     * Create a new currency
     */
    @Transactional
    public Currency createCurrency(String code, String name, String symbol,
                                  BigDecimal exchangeRate, boolean isBaseCurrency, boolean isActive) {
        Currency currency = new Currency();
        currency.setCode(code.toUpperCase());
        currency.setName(name);
        currency.setSymbol(symbol);
        currency.setExchangeRate(exchangeRate);
        currency.setIsBaseCurrency(isBaseCurrency);
        currency.setIsActive(isActive);
        currency.setLastUpdated(LocalDateTime.now());

        Currency savedCurrency = currencyRepository.save(currency);
        log.info("Currency created: {} ({})", savedCurrency.getName(), savedCurrency.getCode());
        return savedCurrency;
    }

    /**
     * Update exchange rate for a currency
     */
    @Transactional
    public Currency updateExchangeRate(String code, BigDecimal newExchangeRate) {
        Currency currency = getCurrencyByCode(code);

        if (currency.getIsBaseCurrency()) {
            throw new IllegalArgumentException("Không thể thay đổi tỷ giá của tiền tệ cơ bản");
        }

        currency.setExchangeRate(newExchangeRate);
        currency.setLastUpdated(LocalDateTime.now());

        Currency updatedCurrency = currencyRepository.save(currency);
        log.info("Exchange rate updated for {}: {}", code, newExchangeRate);
        return updatedCurrency;
    }

    /**
     * Update all exchange rates (for future API integration)
     * This will be called by a scheduled task or admin action
     */
    @Transactional
    public void updateAllExchangeRates() {
        // TODO: Integrate with exchange rate API (e.g., exchangerate-api.com, fixer.io)
        // For now, this is a placeholder
        log.info("Exchange rate update triggered (API integration pending)");
    }
}
