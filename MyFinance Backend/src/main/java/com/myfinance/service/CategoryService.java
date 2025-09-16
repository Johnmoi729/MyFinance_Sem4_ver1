package com.myfinance.service;

import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.entity.Category;
import com.myfinance.entity.TransactionType;
import com.myfinance.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getUserCategories(Long userId) {
        List<Category> categories = categoryRepository.findByUserIdOrderByName(userId);
        return categories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getUserCategoriesByType(Long userId, TransactionType type) {
        List<Category> categories = categoryRepository.findByUserIdAndTypeOrderByName(userId, type);
        return categories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createDefaultCategoriesForUser(Long userId) {
        log.info("Creating default categories for user: {}", userId);

        // Default income categories
        List<CategoryData> incomeCategories = Arrays.asList(
                new CategoryData("Lương", TransactionType.INCOME, "#10B981", "salary"),
                new CategoryData("Thưởng", TransactionType.INCOME, "#059669", "bonus"),
                new CategoryData("Freelance", TransactionType.INCOME, "#047857", "work"),
                new CategoryData("Đầu tư", TransactionType.INCOME, "#065F46", "investment"),
                new CategoryData("Khác", TransactionType.INCOME, "#064E3B", "other")
        );

        // Default expense categories
        List<CategoryData> expenseCategories = Arrays.asList(
                new CategoryData("Ăn uống", TransactionType.EXPENSE, "#EF4444", "food"),
                new CategoryData("Di chuyển", TransactionType.EXPENSE, "#F97316", "transport"),
                new CategoryData("Mua sắm", TransactionType.EXPENSE, "#EAB308", "shopping"),
                new CategoryData("Giải trí", TransactionType.EXPENSE, "#8B5CF6", "entertainment"),
                new CategoryData("Y tế", TransactionType.EXPENSE, "#EC4899", "health"),
                new CategoryData("Học tập", TransactionType.EXPENSE, "#06B6D4", "education"),
                new CategoryData("Hóa đơn", TransactionType.EXPENSE, "#6B7280", "bills"),
                new CategoryData("Nhà ở", TransactionType.EXPENSE, "#84CC16", "housing"),
                new CategoryData("Khác", TransactionType.EXPENSE, "#64748B", "other")
        );

        // Create income categories
        for (CategoryData categoryData : incomeCategories) {
            if (!categoryRepository.existsByUserIdAndNameAndType(userId, categoryData.name, categoryData.type)) {
                Category category = new Category();
                category.setUserId(userId);
                category.setName(categoryData.name);
                category.setType(categoryData.type);
                category.setColor(categoryData.color);
                category.setIcon(categoryData.icon);
                category.setIsDefault(true);
                categoryRepository.save(category);
            }
        }

        // Create expense categories
        for (CategoryData categoryData : expenseCategories) {
            if (!categoryRepository.existsByUserIdAndNameAndType(userId, categoryData.name, categoryData.type)) {
                Category category = new Category();
                category.setUserId(userId);
                category.setName(categoryData.name);
                category.setType(categoryData.type);
                category.setColor(categoryData.color);
                category.setIcon(categoryData.icon);
                category.setIsDefault(true);
                categoryRepository.save(category);
            }
        }

        log.info("Default categories created successfully for user: {}", userId);
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .color(category.getColor())
                .icon(category.getIcon())
                .isDefault(category.getIsDefault())
                .build();
    }

    // Helper class for category data
    private static class CategoryData {
        final String name;
        final TransactionType type;
        final String color;
        final String icon;

        CategoryData(String name, TransactionType type, String color, String icon) {
            this.name = name;
            this.type = type;
            this.color = color;
            this.icon = icon;
        }
    }
}