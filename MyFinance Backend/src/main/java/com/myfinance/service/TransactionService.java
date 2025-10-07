package com.myfinance.service;

import com.myfinance.dto.request.TransactionRequest;
import com.myfinance.dto.response.TransactionResponse;
import com.myfinance.dto.response.CategoryResponse;
import com.myfinance.entity.Transaction;
import com.myfinance.entity.Category;
import com.myfinance.entity.TransactionType;
import com.myfinance.repository.TransactionRepository;
import com.myfinance.repository.CategoryRepository;
import com.myfinance.exception.ResourceNotFoundException;
import com.myfinance.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetService budgetService;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, Long userId) {
        log.info("Creating transaction for user: {}", userId);

        // Validate category exists and belongs to user
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại hoặc không thuộc về người dùng"));

        // Validate transaction type matches category type
        if (!category.getType().equals(request.getType())) {
            throw new BadRequestException("Loại giao dịch không khớp với loại danh mục");
        }

        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created successfully with ID: {}", savedTransaction.getId());

        // Check budget alert for EXPENSE transactions
        if (savedTransaction.getType() == TransactionType.EXPENSE) {
            budgetService.checkAndSendBudgetAlert(userId, savedTransaction.getCategory().getId());
        }

        return mapToTransactionResponse(savedTransaction);
    }

    public TransactionResponse getTransactionById(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch không tồn tại"));

        return mapToTransactionResponse(transaction);
    }

    public List<TransactionResponse> getUserTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getUserTransactionsByType(Long userId, TransactionType type) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndTypeOrderByTransactionDateDesc(userId, type);
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse updateTransaction(Long transactionId, TransactionRequest request, Long userId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch không tồn tại"));

        // Validate category exists and belongs to user
        Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại hoặc không thuộc về người dùng"));

        // Validate transaction type matches category type
        if (!category.getType().equals(request.getType())) {
            throw new BadRequestException("Loại giao dịch không khớp với loại danh mục");
        }

        // Update transaction
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction updatedTransaction = transactionRepository.save(transaction);
        log.info("Transaction updated successfully with ID: {}", updatedTransaction.getId());

        // Check budget alert for EXPENSE transactions
        if (updatedTransaction.getType() == TransactionType.EXPENSE) {
            budgetService.checkAndSendBudgetAlert(userId, updatedTransaction.getCategory().getId());
        }

        return mapToTransactionResponse(updatedTransaction);
    }

    @Transactional
    public void deleteTransaction(Long transactionId, Long userId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch không tồn tại"));

        transactionRepository.delete(transaction);
        log.info("Transaction deleted successfully with ID: {}", transactionId);
    }

    public List<TransactionResponse> getRecentTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> searchTransactions(Long userId, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getUserTransactions(userId);
        }
        
        List<Transaction> transactions = transactionRepository.searchTransactions(userId, searchTerm.trim());
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsWithFilters(Long userId, 
                                                              TransactionType type,
                                                              Long categoryId,
                                                              LocalDate startDate,
                                                              LocalDate endDate,
                                                              String searchTerm) {
        List<Transaction> transactions = transactionRepository.findTransactionsWithFilters(
            userId, type, categoryId, startDate, endDate, 
            (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null
        );
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .category(mapToCategoryResponse(transaction.getCategory()))
                .build();
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

    // Admin functionality methods
    public Long countByUserId(Long userId) {
        return transactionRepository.countByUserId(userId);
    }
}