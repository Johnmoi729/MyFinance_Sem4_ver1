package com.myfinance.service;

import com.myfinance.dto.response.CategoryReportResponse;
import com.myfinance.dto.response.MonthlyReportResponse;
import com.myfinance.dto.response.YearlyReportResponse;
import com.myfinance.entity.Category;
import com.myfinance.entity.Transaction;
import com.myfinance.entity.TransactionType;
import com.myfinance.entity.Budget;
import com.myfinance.repository.BudgetRepository;
import com.myfinance.repository.CategoryRepository;
import com.myfinance.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;

    /**
     * Generate monthly financial summary report
     */
    public MonthlyReportResponse generateMonthlySummary(Long userId, Integer year, Integer month) {
        log.info("Generating monthly report for user {} - {}/{}", userId, year, month);

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // Get transactions for the month
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);

        // Calculate previous month for comparison
        LocalDate prevStartDate = startDate.minusMonths(1);
        LocalDate prevEndDate = prevStartDate.plusMonths(1).minusDays(1);
        List<Transaction> prevTransactions = transactionRepository.findByUserIdAndDateRange(userId, prevStartDate, prevEndDate);

        // Calculate totals
        BigDecimal totalIncome = calculateTotal(transactions, TransactionType.INCOME);
        BigDecimal totalExpense = calculateTotal(transactions, TransactionType.EXPENSE);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        BigDecimal prevIncome = calculateTotal(prevTransactions, TransactionType.INCOME);
        BigDecimal prevExpense = calculateTotal(prevTransactions, TransactionType.EXPENSE);

        // Calculate savings rate
        Double savingsRate = calculateSavingsRate(totalIncome, netSavings);

        // Category breakdowns with budget comparison
        List<MonthlyReportResponse.CategorySummary> incomeByCategory =
            generateCategorySummaries(transactions, TransactionType.INCOME, totalIncome, userId, year, month);
        List<MonthlyReportResponse.CategorySummary> expenseByCategory =
            generateCategorySummaries(transactions, TransactionType.EXPENSE, totalExpense, userId, year, month);

        // Top categories (limit to 5)
        List<MonthlyReportResponse.CategorySummary> topExpenses = expenseByCategory.stream()
            .sorted(Comparator.comparing(MonthlyReportResponse.CategorySummary::getAmount).reversed())
            .limit(5)
            .collect(Collectors.toList());

        List<MonthlyReportResponse.CategorySummary> topIncome = incomeByCategory.stream()
            .sorted(Comparator.comparing(MonthlyReportResponse.CategorySummary::getAmount).reversed())
            .limit(5)
            .collect(Collectors.toList());

        // Statistics
        BigDecimal avgTransaction = transactions.isEmpty() ? BigDecimal.ZERO :
            transactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(transactions.size()), 2, RoundingMode.HALF_UP);

        BigDecimal largestExpense = transactions.stream()
            .filter(t -> t.getType() == TransactionType.EXPENSE)
            .map(Transaction::getAmount)
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        BigDecimal largestIncome = transactions.stream()
            .filter(t -> t.getType() == TransactionType.INCOME)
            .map(Transaction::getAmount)
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        return MonthlyReportResponse.builder()
            .year(year)
            .month(month)
            .monthName(Month.of(month).getDisplayName(TextStyle.FULL, new Locale("vi", "VN")))
            .totalIncome(totalIncome)
            .totalExpense(totalExpense)
            .netSavings(netSavings)
            .savingsRate(savingsRate)
            .previousMonthIncome(prevIncome)
            .previousMonthExpense(prevExpense)
            .incomeChangePercent(calculateChangePercent(totalIncome, prevIncome))
            .expenseChangePercent(calculateChangePercent(totalExpense, prevExpense))
            .incomeByCategory(incomeByCategory)
            .expenseByCategory(expenseByCategory)
            .topExpenseCategories(topExpenses)
            .topIncomeCategories(topIncome)
            .totalTransactions((long) transactions.size())
            .averageTransaction(avgTransaction)
            .largestExpense(largestExpense)
            .largestIncome(largestIncome)
            .build();
    }

    /**
     * Generate yearly financial overview report
     */
    public YearlyReportResponse generateYearlySummary(Long userId, Integer year) {
        log.info("Generating yearly report for user {} - {}", userId, year);

        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        // Get transactions for the year
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);

        // Previous year for comparison
        LocalDate prevStartDate = startDate.minusYears(1);
        LocalDate prevEndDate = endDate.minusYears(1);
        List<Transaction> prevTransactions = transactionRepository.findByUserIdAndDateRange(userId, prevStartDate, prevEndDate);

        // Calculate totals
        BigDecimal totalIncome = calculateTotal(transactions, TransactionType.INCOME);
        BigDecimal totalExpense = calculateTotal(transactions, TransactionType.EXPENSE);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        BigDecimal prevIncome = calculateTotal(prevTransactions, TransactionType.INCOME);
        BigDecimal prevExpense = calculateTotal(prevTransactions, TransactionType.EXPENSE);

        Double savingsRate = calculateSavingsRate(totalIncome, netSavings);

        // Generate monthly trends
        List<YearlyReportResponse.MonthlyTrend> monthlyTrends = new ArrayList<>();
        YearlyReportResponse.MonthlyTrend bestSavings = null;
        YearlyReportResponse.MonthlyTrend worstSavings = null;
        YearlyReportResponse.MonthlyTrend highestIncome = null;
        YearlyReportResponse.MonthlyTrend highestExpense = null;

        for (int month = 1; month <= 12; month++) {
            LocalDate monthStart = LocalDate.of(year, month, 1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

            List<Transaction> monthTransactions = transactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(monthStart) && !t.getTransactionDate().isAfter(monthEnd))
                .collect(Collectors.toList());

            BigDecimal monthIncome = calculateTotal(monthTransactions, TransactionType.INCOME);
            BigDecimal monthExpense = calculateTotal(monthTransactions, TransactionType.EXPENSE);
            BigDecimal monthSavings = monthIncome.subtract(monthExpense);
            Double monthSavingsRate = calculateSavingsRate(monthIncome, monthSavings);

            YearlyReportResponse.MonthlyTrend trend = YearlyReportResponse.MonthlyTrend.builder()
                .month(month)
                .monthName(Month.of(month).getDisplayName(TextStyle.FULL, new Locale("vi", "VN")))
                .income(monthIncome)
                .expense(monthExpense)
                .savings(monthSavings)
                .savingsRate(monthSavingsRate)
                .build();

            monthlyTrends.add(trend);

            // Track best/worst months
            if (bestSavings == null || monthSavings.compareTo(bestSavings.getSavings()) > 0) {
                bestSavings = trend;
            }
            if (worstSavings == null || monthSavings.compareTo(worstSavings.getSavings()) < 0) {
                worstSavings = trend;
            }
            if (highestIncome == null || monthIncome.compareTo(highestIncome.getIncome()) > 0) {
                highestIncome = trend;
            }
            if (highestExpense == null || monthExpense.compareTo(highestExpense.getExpense()) > 0) {
                highestExpense = trend;
            }
        }

        // Category totals for the year (use current month for budget comparison as yearly budgets aren't standard)
        List<MonthlyReportResponse.CategorySummary> yearlyIncomeByCategory =
            generateCategorySummaries(transactions, TransactionType.INCOME, totalIncome, userId, year, 12);
        List<MonthlyReportResponse.CategorySummary> yearlyExpenseByCategory =
            generateCategorySummaries(transactions, TransactionType.EXPENSE, totalExpense, userId, year, 12);

        // Top categories (limit to 5)
        List<MonthlyReportResponse.CategorySummary> topExpenses = yearlyExpenseByCategory.stream()
            .sorted(Comparator.comparing(MonthlyReportResponse.CategorySummary::getAmount).reversed())
            .limit(5)
            .collect(Collectors.toList());

        List<MonthlyReportResponse.CategorySummary> topIncome = yearlyIncomeByCategory.stream()
            .sorted(Comparator.comparing(MonthlyReportResponse.CategorySummary::getAmount).reversed())
            .limit(5)
            .collect(Collectors.toList());

        // Calculate averages
        BigDecimal avgMonthlyIncome = totalIncome.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        BigDecimal avgMonthlyExpense = totalExpense.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        return YearlyReportResponse.builder()
            .year(year)
            .totalIncome(totalIncome)
            .totalExpense(totalExpense)
            .netSavings(netSavings)
            .savingsRate(savingsRate)
            .previousYearIncome(prevIncome)
            .previousYearExpense(prevExpense)
            .incomeChangePercent(calculateChangePercent(totalIncome, prevIncome))
            .expenseChangePercent(calculateChangePercent(totalExpense, prevExpense))
            .monthlyTrends(monthlyTrends)
            .bestSavingsMonth(bestSavings)
            .worstSavingsMonth(worstSavings)
            .highestIncomeMonth(highestIncome)
            .highestExpenseMonth(highestExpense)
            .yearlyIncomeByCategory(yearlyIncomeByCategory)
            .yearlyExpenseByCategory(yearlyExpenseByCategory)
            .topExpenseCategories(topExpenses)
            .topIncomeCategories(topIncome)
            .totalTransactions((long) transactions.size())
            .averageMonthlyIncome(avgMonthlyIncome)
            .averageMonthlyExpense(avgMonthlyExpense)
            .build();
    }

    /**
     * Generate category-specific analysis report
     */
    public CategoryReportResponse generateCategoryReport(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating category report for user {} - category {} from {} to {}",
            userId, categoryId, startDate, endDate);

        // Validate category ownership
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục hoặc bạn không có quyền truy cập"));

        // Get transactions for the category
        List<Transaction> transactions = transactionRepository.findByUserIdAndCategoryIdOrderByTransactionDateDesc(userId, categoryId)
            .stream()
            .filter(t -> !t.getTransactionDate().isBefore(startDate) && !t.getTransactionDate().isAfter(endDate))
            .collect(Collectors.toList());

        // Calculate summary statistics
        BigDecimal totalAmount = transactions.stream()
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgTransaction = transactions.isEmpty() ? BigDecimal.ZERO :
            totalAmount.divide(BigDecimal.valueOf(transactions.size()), 2, RoundingMode.HALF_UP);

        BigDecimal minTransaction = transactions.stream()
            .map(Transaction::getAmount)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        BigDecimal maxTransaction = transactions.stream()
            .map(Transaction::getAmount)
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        // Generate period summaries (monthly breakdown)
        List<CategoryReportResponse.PeriodSummary> periodSummaries = new ArrayList<>();
        LocalDate currentPeriod = startDate.withDayOfMonth(1);

        while (!currentPeriod.isAfter(endDate)) {
            LocalDate periodEnd = currentPeriod.plusMonths(1).minusDays(1);
            if (periodEnd.isAfter(endDate)) {
                periodEnd = endDate;
            }

            // Make variables effectively final for lambda
            final LocalDate finalCurrentPeriod = currentPeriod;
            final LocalDate finalPeriodEnd = periodEnd;

            List<Transaction> periodTransactions = transactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(finalCurrentPeriod) && !t.getTransactionDate().isAfter(finalPeriodEnd))
                .collect(Collectors.toList());

            BigDecimal periodAmount = periodTransactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            periodSummaries.add(CategoryReportResponse.PeriodSummary.builder()
                .periodLabel(finalCurrentPeriod.getYear() + "-" + String.format("%02d", finalCurrentPeriod.getMonthValue()))
                .periodStart(finalCurrentPeriod)
                .periodEnd(finalPeriodEnd)
                .amount(periodAmount)
                .transactionCount((long) periodTransactions.size())
                .build());

            currentPeriod = currentPeriod.plusMonths(1);
        }

        return CategoryReportResponse.builder()
            .categoryId(categoryId)
            .categoryName(category.getName())
            .categoryColor(category.getColor())
            .categoryIcon(category.getIcon())
            .categoryType(category.getType().name())
            .startDate(startDate)
            .endDate(endDate)
            .totalAmount(totalAmount)
            .transactionCount((long) transactions.size())
            .averageTransaction(avgTransaction)
            .minTransaction(minTransaction)
            .maxTransaction(maxTransaction)
            .periodSummaries(periodSummaries)
            .build();
    }

    // Helper methods

    private BigDecimal calculateTotal(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
            .filter(t -> t.getType() == type)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Double calculateSavingsRate(BigDecimal income, BigDecimal savings) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return savings.divide(income, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .doubleValue();
    }

    private Double calculateChangePercent(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) == 0 ? 0.0 : 100.0;
        }
        return current.subtract(previous)
            .divide(previous, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .doubleValue();
    }

    private List<MonthlyReportResponse.CategorySummary> generateCategorySummaries(
            List<Transaction> transactions, TransactionType type, BigDecimal total,
            Long userId, Integer year, Integer month) {

        Map<Category, List<Transaction>> groupedByCategory = transactions.stream()
            .filter(t -> t.getType() == type)
            .collect(Collectors.groupingBy(Transaction::getCategory));

        // Get budgets for this period
        Map<Long, Budget> budgetMap = budgetRepository
            .findByUserIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(userId, year, month)
            .stream()
            .collect(Collectors.toMap(budget -> budget.getCategory().getId(), budget -> budget));

        return groupedByCategory.entrySet().stream()
            .map(entry -> {
                Category category = entry.getKey();
                List<Transaction> categoryTransactions = entry.getValue();

                BigDecimal amount = categoryTransactions.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                Double percentage = total.compareTo(BigDecimal.ZERO) == 0 ? 0.0 :
                    amount.divide(total, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();

                // Budget comparison data
                Budget budget = budgetMap.get(category.getId());
                BigDecimal budgetAmount = budget != null ? budget.getBudgetAmount() : null;
                BigDecimal budgetDifference = null;
                Double budgetUsagePercent = null;

                if (budgetAmount != null && budgetAmount.compareTo(BigDecimal.ZERO) > 0) {
                    budgetDifference = amount.subtract(budgetAmount);
                    budgetUsagePercent = amount.divide(budgetAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
                }

                return MonthlyReportResponse.CategorySummary.builder()
                    .categoryId(category.getId())
                    .categoryName(category.getName())
                    .categoryColor(category.getColor())
                    .categoryIcon(category.getIcon())
                    .amount(amount)
                    .transactionCount((long) categoryTransactions.size())
                    .percentage(percentage)
                    .budgetAmount(budgetAmount)
                    .budgetDifference(budgetDifference)
                    .budgetUsagePercent(budgetUsagePercent)
                    .build();
            })
            .sorted(Comparator.comparing(MonthlyReportResponse.CategorySummary::getAmount).reversed())
            .collect(Collectors.toList());
    }
}
