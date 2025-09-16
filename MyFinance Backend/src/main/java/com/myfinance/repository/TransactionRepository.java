package com.myfinance.repository;

import com.myfinance.entity.Transaction;
import com.myfinance.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find transaction by ID and user ID (for security)
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    // Find all transactions for a specific user
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    // Find transactions by user and type
    List<Transaction> findByUserIdAndTypeOrderByTransactionDateDesc(Long userId, TransactionType type);

    // Find transactions by user within date range
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") Long userId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    // Find recent transactions for a user (last 10)
    List<Transaction> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

    // Count transactions by user and type
    long countByUserIdAndType(Long userId, TransactionType type);

    // Find transactions by category
    List<Transaction> findByUserIdAndCategoryIdOrderByTransactionDateDesc(Long userId, Long categoryId);

    // Count transactions by category
    long countByUserIdAndCategoryId(Long userId, Long categoryId);
}