package com.myfinance.repository;

import com.myfinance.entity.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {

    // Find currency by code (e.g., "VND", "USD")
    Optional<Currency> findByCode(String code);

    // Find all active currencies
    List<Currency> findByIsActiveTrueOrderByName();

    // Find base currency (VND by default)
    Optional<Currency> findByIsBaseCurrencyTrue();

    // Find all currencies ordered by name
    List<Currency> findAllByOrderByName();

    // Check if currency code exists
    boolean existsByCode(String code);
}
