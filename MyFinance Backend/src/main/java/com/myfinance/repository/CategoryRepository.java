package com.myfinance.repository;

import com.myfinance.entity.Category;
import com.myfinance.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by ID and user ID (for security)
    Optional<Category> findByIdAndUserId(Long id, Long userId);

    // Find all categories for a user
    List<Category> findByUserIdOrderByName(Long userId);

    // Find categories by user and type
    List<Category> findByUserIdAndTypeOrderByName(Long userId, TransactionType type);

    // Find default categories
    List<Category> findByIsDefaultTrueOrderByName();

    // Check if category name exists for user
    boolean existsByUserIdAndNameAndType(Long userId, String name, TransactionType type);

    // Admin functionality methods
    Long countByUserId(Long userId);
}