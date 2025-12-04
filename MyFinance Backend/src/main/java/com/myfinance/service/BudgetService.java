package com.myfinance.service;

import com.myfinance.dto.request.BudgetRequest;
import com.myfinance.dto.response.BudgetResponse;
import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.dto.response.BudgetUsageResponse;
import com.myfinance.dto.response.BudgetWarningResponse;
import com.myfinance.dto.response.BudgetPerformanceResponse;
import com.myfinance.dto.response.BudgetDashboardResponse;
import com.myfinance.entity.Budget;
import com.myfinance.entity.Category;
import com.myfinance.entity.TransactionType;
import com.myfinance.entity.BudgetStatus;
import com.myfinance.entity.Transaction;
import com.myfinance.exception.BadRequestException;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.repository.BudgetRepository;
import com.myfinance.repository.CategoryRepository;
import com.myfinance.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserBudgetSettingsService userBudgetSettingsService;
    private final EmailService emailService;
    private final com.myfinance.repository.UserRepository userRepository;
    private final CurrencyService currencyService;

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

        // Set currency and convert to base currency
        String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
        budget.setCurrencyCode(currencyCode);
        budget.setBudgetAmountInBaseCurrency(
            currencyService.convertToBaseCurrency(request.getBudgetAmount(), currencyCode)
        );

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

        // Update currency and convert to base currency
        String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
        budget.setCurrencyCode(currencyCode);
        budget.setBudgetAmountInBaseCurrency(
            currencyService.convertToBaseCurrency(request.getBudgetAmount(), currencyCode)
        );

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

    // ===== BUDGET ANALYTICS METHODS =====

    public List<BudgetUsageResponse> getBudgetUsageAnalytics(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdAndIsActiveTrueOrderByBudgetYearDescBudgetMonthDesc(userId);
        return budgets.stream()
                .map(budget -> calculateBudgetUsage(budget, userId))
                .collect(Collectors.toList());
    }

    public List<BudgetUsageResponse> getCurrentMonthBudgetUsage(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Budget> budgets = budgetRepository.findByUserIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                userId, now.getYear(), now.getMonthValue());

        return budgets.stream()
                .map(budget -> calculateBudgetUsage(budget, userId))
                .collect(Collectors.toList());
    }

    public BudgetWarningResponse getBudgetWarnings(Long userId) {
        List<BudgetUsageResponse> usageList = getCurrentMonthBudgetUsage(userId);

        // Get user's configurable threshold
        double warningThreshold = userBudgetSettingsService.getWarningThreshold(userId);

        List<BudgetWarningResponse.BudgetAlert> alerts = usageList.stream()
                .filter(usage -> usage.getUsagePercentage() >= warningThreshold)
                .map(usage -> createBudgetAlert(usage, userId))
                .collect(Collectors.toList());

        long warningCount = alerts.stream()
                .filter(alert -> "WARNING".equals(alert.getAlertType()))
                .count();

        long overBudgetCount = alerts.stream()
                .filter(alert -> "OVER_BUDGET".equals(alert.getAlertType()))
                .count();

        return BudgetWarningResponse.builder()
                .totalBudgets(usageList.size())
                .warningCount((int) warningCount)
                .overBudgetCount((int) overBudgetCount)
                .alerts(alerts)
                .build();
    }

    public BudgetPerformanceResponse getBudgetPerformance(Long userId) {
        List<BudgetUsageResponse> usageList = getCurrentMonthBudgetUsage(userId);

        BigDecimal totalBudget = usageList.stream()
                .map(BudgetUsageResponse::getBudgetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSpent = usageList.stream()
                .map(BudgetUsageResponse::getActualSpent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRemaining = totalBudget.subtract(totalSpent);

        double overallUsage = totalBudget.compareTo(BigDecimal.ZERO) > 0
                ? totalSpent.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                : 0.0;

        int onTrack = (int) usageList.stream().filter(u -> "GREEN".equals(u.getStatus())).count();
        int atRisk = (int) usageList.stream().filter(u -> "YELLOW".equals(u.getStatus())).count();
        int overLimit = (int) usageList.stream().filter(u -> "RED".equals(u.getStatus())).count();

        List<BudgetPerformanceResponse.CategoryPerformance> categoryPerformances = usageList.stream()
                .map(this::createCategoryPerformance)
                .collect(Collectors.toList());

        return BudgetPerformanceResponse.builder()
                .totalBudgetAmount(totalBudget)
                .totalActualSpent(totalSpent)
                .totalRemainingAmount(totalRemaining)
                .overallUsagePercentage(overallUsage)
                .activeBudgets(usageList.size())
                .budgetsOnTrack(onTrack)
                .budgetsAtRisk(atRisk)
                .budgetsOverLimit(overLimit)
                .categoryPerformances(categoryPerformances)
                .build();
    }

    public BudgetDashboardResponse getBudgetDashboard(Long userId) {
        BudgetPerformanceResponse performance = getBudgetPerformance(userId);
        List<BudgetUsageResponse> recentBudgets = getCurrentMonthBudgetUsage(userId).stream()
                .limit(5)
                .collect(Collectors.toList());

        BudgetWarningResponse warnings = getBudgetWarnings(userId);
        List<BudgetWarningResponse.BudgetAlert> urgentAlerts = warnings.getAlerts().stream()
                .filter(alert -> "OVER_BUDGET".equals(alert.getAlertType()))
                .limit(3)
                .collect(Collectors.toList());

        List<BudgetDashboardResponse.BudgetSummary> budgetSummaries = recentBudgets.stream()
                .map(this::createBudgetSummary)
                .collect(Collectors.toList());

        return BudgetDashboardResponse.builder()
                .totalBudgetAmount(performance.getTotalBudgetAmount())
                .totalActualSpent(performance.getTotalActualSpent())
                .totalRemainingAmount(performance.getTotalRemainingAmount())
                .overallUsagePercentage(performance.getOverallUsagePercentage())
                .totalBudgets(performance.getActiveBudgets())
                .budgetsOnTrack(performance.getBudgetsOnTrack())
                .budgetsAtRisk(performance.getBudgetsAtRisk())
                .budgetsOverLimit(performance.getBudgetsOverLimit())
                .recentBudgets(budgetSummaries)
                .urgentAlerts(urgentAlerts)
                .build();
    }

    // ===== PRIVATE HELPER METHODS =====

    private BudgetUsageResponse calculateBudgetUsage(Budget budget, Long userId) {
        BigDecimal actualSpent = calculateActualSpending(budget, userId);
        // Use base currency amount for accurate multi-currency calculation
        BigDecimal remaining = budget.getBudgetAmountInBaseCurrency().subtract(actualSpent);

        double usagePercentage = budget.getBudgetAmountInBaseCurrency().compareTo(BigDecimal.ZERO) > 0
                ? actualSpent.divide(budget.getBudgetAmountInBaseCurrency(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                : 0.0;

        BudgetStatus status = getBudgetStatus(usagePercentage, userId);

        String statusMessage = generateStatusMessage(usagePercentage, remaining);

        return BudgetUsageResponse.builder()
                .budgetId(budget.getId())
                .categoryName(budget.getCategory().getName())
                .categoryColor(budget.getCategory().getColor())
                .categoryIcon(budget.getCategory().getIcon())
                .budgetAmount(budget.getBudgetAmountInBaseCurrency())
                .actualSpent(actualSpent)
                .remainingAmount(remaining)
                .usagePercentage(usagePercentage)
                .status(status.name())
                .budgetYear(budget.getBudgetYear())
                .budgetMonth(budget.getBudgetMonth())
                .budgetPeriod(budget.getBudgetPeriod())
                .isOverBudget(usagePercentage >= 100.0)
                .statusMessage(statusMessage)
                .build();
    }

    /**
     * Check budget threshold and send email alert if needed
     * Called after transaction creation/update
     */
    public void checkAndSendBudgetAlert(Long userId, Long categoryId) {
        try {
            // Get user info
            com.myfinance.entity.User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                log.warn("User not found for budget alert: {}", userId);
                return;
            }

            // Get user's threshold settings
            double warningThreshold = userBudgetSettingsService.getWarningThreshold(userId);
            double criticalThreshold = userBudgetSettingsService.getCriticalThreshold(userId);

            // Get current month's budget for this category
            LocalDateTime now = LocalDateTime.now();
            Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                    userId, categoryId, now.getYear(), now.getMonthValue());

            if (budgetOpt.isEmpty()) {
                log.debug("No active budget found for user {} category {} period {}/{}",
                          userId, categoryId, now.getYear(), now.getMonthValue());
                return; // No budget set for this category/period
            }

            Budget budget = budgetOpt.get();
            BudgetUsageResponse usage = calculateBudgetUsage(budget, userId);

            // Check if usage percentage exceeds threshold
            if (usage.getUsagePercentage() >= warningThreshold) {
                // Send budget alert email
                emailService.sendBudgetAlertEmail(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        budget.getCategory().getName(),
                        budget.getBudgetAmount(),
                        usage.getActualSpent(),
                        usage.getUsagePercentage()
                );

                log.info("Budget alert email sent to user: {} for category: {} ({}%)",
                        user.getEmail(), budget.getCategory().getName(), usage.getUsagePercentage());
            }
        } catch (Exception e) {
            log.error("Failed to check/send budget alert for user: {}, category: {}", userId, categoryId, e);
            // Don't fail the transaction if email fails
        }
    }

    private BigDecimal calculateActualSpending(Budget budget, Long userId) {
        // Get first and last day of the budget month
        LocalDate startDate = LocalDate.of(budget.getBudgetYear(), budget.getBudgetMonth(), 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Find all expense transactions for this category in the budget period
        List<Transaction> transactions = transactionRepository.findTransactionsWithFilters(
                userId,
                TransactionType.EXPENSE,
                budget.getCategory().getId(),
                startDate,
                endDate,
                null
        );

        // Sum amounts in base currency for accurate multi-currency calculation
        return transactions.stream()
                .map(Transaction::getAmountInBaseCurrency)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String generateStatusMessage(double usagePercentage, BigDecimal remainingAmount) {
        if (usagePercentage >= 100.0) {
            BigDecimal overAmount = remainingAmount.abs();
            return String.format("Vượt ngân sách %s", formatCurrency(overAmount));
        } else if (usagePercentage >= 90.0) {
            return String.format("Còn lại %s - Gần hết ngân sách!", formatCurrency(remainingAmount));
        } else if (usagePercentage >= 75.0) {
            return String.format("Còn lại %s - Cần chú ý", formatCurrency(remainingAmount));
        } else {
            return String.format("Còn lại %s", formatCurrency(remainingAmount));
        }
    }

    private BudgetWarningResponse.BudgetAlert createBudgetAlert(BudgetUsageResponse usage, Long userId) {
        double warningThreshold = userBudgetSettingsService.getWarningThreshold(userId);
        double criticalThreshold = userBudgetSettingsService.getCriticalThreshold(userId);

        String alertType;
        String alertLevel;

        if (usage.getUsagePercentage() >= 100.0) {
            alertType = "OVER_BUDGET";
            alertLevel = "RED";
        } else if (usage.getUsagePercentage() >= criticalThreshold) {
            alertType = "CRITICAL";
            alertLevel = "RED";
        } else if (usage.getUsagePercentage() >= warningThreshold) {
            alertType = "WARNING";
            alertLevel = "YELLOW";
        } else {
            alertType = "NORMAL";
            alertLevel = "GREEN";
        }

        String message = usage.getUsagePercentage() >= 100.0
                ? String.format("Đã vượt ngân sách %,.0f%%", usage.getUsagePercentage())
                : usage.getUsagePercentage() >= criticalThreshold
                    ? String.format("Nguy hiểm - Đã sử dụng %,.0f%% ngân sách", usage.getUsagePercentage())
                    : String.format("Cảnh báo - Đã sử dụng %,.0f%% ngân sách", usage.getUsagePercentage());

        return BudgetWarningResponse.BudgetAlert.builder()
                .budgetId(usage.getBudgetId())
                .categoryName(usage.getCategoryName())
                .categoryColor(usage.getCategoryColor())
                .alertType(alertType)
                .alertLevel(alertLevel)
                .budgetAmount(usage.getBudgetAmount())
                .actualSpent(usage.getActualSpent())
                .usagePercentage(usage.getUsagePercentage())
                .message(message)
                .budgetYear(usage.getBudgetYear())
                .budgetMonth(usage.getBudgetMonth())
                .build();
    }

    private BudgetPerformanceResponse.CategoryPerformance createCategoryPerformance(BudgetUsageResponse usage) {
        String trend = determineTrend(usage.getUsagePercentage()); // For now, default to "STABLE"

        return BudgetPerformanceResponse.CategoryPerformance.builder()
                .categoryId(usage.getBudgetId())
                .categoryName(usage.getCategoryName())
                .categoryColor(usage.getCategoryColor())
                .categoryIcon(usage.getCategoryIcon())
                .budgetAmount(usage.getBudgetAmount())
                .actualSpent(usage.getActualSpent())
                .usagePercentage(usage.getUsagePercentage())
                .status(usage.getStatus())
                .trend(trend)
                .build();
    }

    private BudgetDashboardResponse.BudgetSummary createBudgetSummary(BudgetUsageResponse usage) {
        return BudgetDashboardResponse.BudgetSummary.builder()
                .budgetId(usage.getBudgetId())
                .categoryName(usage.getCategoryName())
                .categoryColor(usage.getCategoryColor())
                .categoryIcon(usage.getCategoryIcon())
                .budgetAmount(usage.getBudgetAmount())
                .actualSpent(usage.getActualSpent())
                .usagePercentage(usage.getUsagePercentage())
                .status(usage.getStatus())
                .isCurrentMonth(true) // Current month budgets
                .build();
    }

    private String determineTrend(double usagePercentage) {
        // For now, return STABLE. In the future, this could compare with previous periods
        return "STABLE";
    }

    private String formatCurrency(BigDecimal amount) {
        return String.format("%,.0f VND", amount);
    }

    private BudgetStatus getBudgetStatus(double usagePercentage, Long userId) {
        double warningThreshold = userBudgetSettingsService.getWarningThreshold(userId);
        double criticalThreshold = userBudgetSettingsService.getCriticalThreshold(userId);

        if (usagePercentage >= 100.0) {
            return BudgetStatus.RED;
        } else if (usagePercentage >= criticalThreshold) {
            return BudgetStatus.RED;
        } else if (usagePercentage >= warningThreshold) {
            return BudgetStatus.YELLOW;
        } else {
            return BudgetStatus.GREEN;
        }
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
                .currencyCode(budget.getCurrencyCode())
                .budgetAmountInBaseCurrency(budget.getBudgetAmountInBaseCurrency())
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

    // Admin functionality methods
    public Long countByUserId(Long userId) {
        return budgetRepository.countByUserId(userId);
    }
}