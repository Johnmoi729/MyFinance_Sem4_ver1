package com.myfinance.service;

import com.myfinance.dto.request.BudgetRequest;
import com.myfinance.dto.response.BudgetResponse;
import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.entity.Budget;
import com.myfinance.entity.Category;
import com.myfinance.entity.TransactionType;
import com.myfinance.exception.BadRequestException;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.BudgetRepository;
import com.myfinance.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    @PostConstruct
    public void init() {
        log.info("BudgetService initialized successfully!");
    }

    public List<BudgetResponse> getUserBudgets(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdAndIsActiveTrueOrderByBudgetYearDescBudgetMonthDesc(userId);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getBudgetsForPeriod(Long userId, Integer budgetYear, Integer budgetMonth) {
        List<Budget> budgets = budgetRepository.findByUserIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                userId, budgetYear, budgetMonth);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getBudgetsForYear(Long userId, Integer budgetYear) {
        List<Budget> budgets = budgetRepository.findByUserIdAndBudgetYearAndIsActiveTrueOrderByBudgetMonthDesc(userId, budgetYear);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getBudgetsByCategory(Long userId, Long categoryId) {
        List<Budget> budgets = budgetRepository.findByUserIdAndCategoryIdAndIsActiveTrue(userId, categoryId);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getCurrentMonthBudgets(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return getBudgetsForPeriod(userId, now.getYear(), now.getMonthValue());
    }

    public List<BudgetResponse> getBudgetsByType(Long userId, TransactionType type) {
        List<Budget> budgets = budgetRepository.findByUserIdAndCategoryType(userId, type);
        return budgets.stream()
                .map(this::mapToBudgetResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse getBudgetById(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Ngân sách không tồn tại"));
        
        return mapToBudgetResponse(budget);
    }

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request, Long userId) {
        log.info("Creating budget for user: {} for period: {}-{}", userId, request.getBudgetYear(), request.getBudgetMonth());

        // Validate category exists and belongs to user
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại hoặc không thuộc về người dùng"));

        // Only allow budgets for EXPENSE categories (budgets are for controlling spending)
        if (category.getType() != TransactionType.EXPENSE) {
            throw new BadRequestException("Chỉ có thể tạo ngân sách cho danh mục chi tiêu");
        }

        // Check if budget already exists for this category and period
        if (budgetRepository.existsByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                userId, request.getCategoryId(), request.getBudgetYear(), request.getBudgetMonth())) {
            throw new BadRequestException("Ngân sách cho danh mục này trong tháng " + 
                    request.getBudgetMonth() + "/" + request.getBudgetYear() + " đã tồn tại");
        }

        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategory(category);
        budget.setBudgetAmount(request.getBudgetAmount());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setDescription(request.getDescription());
        budget.setIsActive(true);

        Budget savedBudget = budgetRepository.save(budget);
        log.info("Budget created successfully with ID: {}", savedBudget.getId());

        return mapToBudgetResponse(savedBudget);
    }

    @Transactional
    public BudgetResponse updateBudget(Long budgetId, BudgetRequest request, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Ngân sách không tồn tại"));

        // Validate category exists and belongs to user
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại hoặc không thuộc về người dùng"));

        // Only allow budgets for EXPENSE categories
        if (category.getType() != TransactionType.EXPENSE) {
            throw new BadRequestException("Chỉ có thể tạo ngân sách cho danh mục chi tiêu");
        }

        // Check if changing to a different category/period that already has a budget
        boolean categoryOrPeriodChanged = !budget.getCategory().getId().equals(request.getCategoryId()) ||
                !budget.getBudgetYear().equals(request.getBudgetYear()) ||
                !budget.getBudgetMonth().equals(request.getBudgetMonth());

        if (categoryOrPeriodChanged && budgetRepository.existsByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                userId, request.getCategoryId(), request.getBudgetYear(), request.getBudgetMonth())) {
            throw new BadRequestException("Ngân sách cho danh mục này trong tháng " + 
                    request.getBudgetMonth() + "/" + request.getBudgetYear() + " đã tồn tại");
        }

        budget.setCategory(category);
        budget.setBudgetAmount(request.getBudgetAmount());
        budget.setBudgetYear(request.getBudgetYear());
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setDescription(request.getDescription());

        Budget updatedBudget = budgetRepository.save(budget);
        log.info("Budget updated successfully with ID: {}", budgetId);

        return mapToBudgetResponse(updatedBudget);
    }

    @Transactional
    public void deleteBudget(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Ngân sách không tồn tại"));

        // Soft delete
        budget.setIsActive(false);
        budgetRepository.save(budget);
        
        log.info("Budget soft deleted successfully with ID: {}", budgetId);
    }

    private BudgetResponse mapToBudgetResponse(Budget budget) {
        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(budget.getCategory().getId())
                .name(budget.getCategory().getName())
                .type(budget.getCategory().getType())
                .color(budget.getCategory().getColor())
                .icon(budget.getCategory().getIcon())
                .isDefault(budget.getCategory().getIsDefault())
                .build();

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(categoryResponse)
                .budgetAmount(budget.getBudgetAmount())
                .budgetYear(budget.getBudgetYear())
                .budgetMonth(budget.getBudgetMonth())
                .budgetPeriod(budget.getBudgetPeriod())
                .description(budget.getDescription())
                .isActive(budget.getIsActive())
                .isCurrentMonth(budget.isCurrentMonth())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}