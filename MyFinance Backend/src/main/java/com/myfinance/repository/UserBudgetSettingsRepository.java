package com.myfinance.repository;

import com.myfinance.entity.UserBudgetSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserBudgetSettingsRepository extends JpaRepository<UserBudgetSettings, Long> {

    Optional<UserBudgetSettings> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    void deleteByUserId(Long userId);
}