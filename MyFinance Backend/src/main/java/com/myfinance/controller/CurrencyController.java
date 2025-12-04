package com.myfinance.controller;

import com.myfinance.dto.response.ApiResponse;
import com.myfinance.entity.Currency;
import com.myfinance.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/currencies")
@RequiredArgsConstructor
@Slf4j
public class CurrencyController {

    private final CurrencyService currencyService;

    /**
     * Get all active currencies
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Currency>>> getAllActiveCurrencies() {
        List<Currency> currencies = currencyService.getAllActiveCurrencies();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tiền tệ thành công", currencies));
    }

    /**
     * Get currency by code
     */
    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<Currency>> getCurrencyByCode(@PathVariable String code) {
        Currency currency = currencyService.getCurrencyByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tiền tệ thành công", currency));
    }

    /**
     * Get base currency
     */
    @GetMapping("/base")
    public ResponseEntity<ApiResponse<Currency>> getBaseCurrency() {
        Currency currency = currencyService.getBaseCurrency();
        return ResponseEntity.ok(ApiResponse.success("Lấy tiền tệ cơ bản thành công", currency));
    }
}
