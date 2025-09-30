package com.myfinance.repository;

import com.myfinance.entity.Budget;
import com.myfinance.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Find budget by ID and user ID (for security)
    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    // Find all budgets for a user
    List<Budget> findByUserIdAndIsActiveTrueOrderByBudgetYearDescBudgetMonthDesc(Long userId);

    // Find budgets for a specific month and year
    List<Budget> findByUserIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(Long userId, Integer budgetYear, Integer budgetMonth);

    // Find budget for specific category and period
    Optional<Budget> findByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
            Long userId, Long categoryId, Integer budgetYear, Integer budgetMonth);

    // Find budgets for a specific year
    List<Budget> findByUserIdAndBudgetYearAndIsActiveTrueOrderByBudgetMonthDesc(Long userId, Integer budgetYear);

    // Find budgets for a specific category
    List<Budget> findByUserIdAndCategoryIdAndIsActiveTrue(Long userId, Long categoryId);

    // Find current month budgets
    @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.budgetYear = :currentYear AND b.budgetMonth = :currentMonth AND b.isActive = true")
    List<Budget> findCurrentMonthBudgets(@Param("userId") Long userId, 
                                       @Param("currentYear") Integer currentYear, 
                                       @Param("currentMonth") Integer currentMonth);

    // Find budgets by category type (INCOME/EXPENSE)
    @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.category.type = :type AND b.isActive = true ORDER BY b.budgetYear DESC, b.budgetMonth DESC")
    List<Budget> findByUserIdAndCategoryType(@Param("userId") Long userId, @Param("type") TransactionType type);

    // Check if budget exists for category and period
    boolean existsByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
            Long userId, Long categoryId, Integer budgetYear, Integer budgetMonth);

    // Get total budget amount for a period
    @Query("SELECT COALESCE(SUM(b.budgetAmount), 0) FROM Budget b WHERE b.userId = :userId AND b.budgetYear = :year AND b.budgetMonth = :month AND b.isActive = true")
    Double getTotalBudgetForPeriod(@Param("userId") Long userId, 
                                 @Param("year") Integer year, 
                                 @Param("month") Integer month);

    // Get budget statistics for dashboard
    @Query("SELECT NEW map(" +
           "COUNT(b) as totalBudgets, " +
           "COALESCE(SUM(b.budgetAmount), 0) as totalBudgetAmount, " +
           "COALESCE(AVG(b.budgetAmount), 0) as avgBudgetAmount) " +
           "FROM Budget b WHERE b.userId = :userId AND b.budgetYear = :year AND b.budgetMonth = :month AND b.isActive = true")
    List<Object> getBudgetStatistics(@Param("userId") Long userId,
                                   @Param("year") Integer year,
                                   @Param("month") Integer month);

    // Admin functionality methods
    Long countByUserId(Long userId);
}