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

    // Search transactions by description or amount
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND " +
           "(LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CAST(t.amount AS string) LIKE CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> searchTransactions(@Param("userId") Long userId, 
                                       @Param("searchTerm") String searchTerm);

    // Find transactions with multiple filters
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "AND (:searchTerm IS NULL OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CAST(t.amount AS string) LIKE CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsWithFilters(@Param("userId") Long userId,
                                                 @Param("type") TransactionType type,
                                                 @Param("categoryId") Long categoryId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate,
                                                 @Param("searchTerm") String searchTerm);

    // Admin functionality methods
    Long countByUserId(Long userId);

    List<Transaction> findByTransactionDate(LocalDate date);

    List<Transaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    // Analytics methods
    long countByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
}