import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/transaction_service.dart';
import '../../models/transaction.dart';
import '../../models/category.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  final TransactionService _transactionService = TransactionService();

  List<Transaction> _transactions = [];
  bool _isLoading = true;
  TransactionType? _filterType;

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  Future<void> _loadTransactions() async {
    setState(() => _isLoading = true);

    final response = await _transactionService.getTransactions(type: _filterType);
    if (response.success && response.data != null) {
      _transactions = response.data!;
    }

    setState(() => _isLoading = false);
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  Future<void> _deleteTransaction(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận'),
        content: const Text('Bạn có chắc muốn xóa giao dịch này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final response = await _transactionService.deleteTransaction(id);
      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã xóa giao dịch')),
        );
        _loadTransactions();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Giao dịch'),
        actions: [
          PopupMenuButton<TransactionType?>(
            icon: const Icon(Icons.filter_list),
            onSelected: (value) {
              setState(() => _filterType = value);
              _loadTransactions();
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: null,
                child: Text('Tất cả'),
              ),
              const PopupMenuItem(
                value: TransactionType.INCOME,
                child: Text('Thu nhập'),
              ),
              const PopupMenuItem(
                value: TransactionType.EXPENSE,
                child: Text('Chi tiêu'),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadTransactions,
              child: _transactions.isEmpty
                  ? const Center(child: Text('Chưa có giao dịch nào'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount: _transactions.length,
                      itemBuilder: (context, index) {
                        final transaction = _transactions[index];
                        return _buildTransactionCard(transaction);
                      },
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.pushNamed(context, '/transactions/add');
          if (result == true) {
            _loadTransactions();
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildTransactionCard(Transaction transaction) {
    final isIncome = transaction.type == TransactionType.INCOME;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: isIncome
              ? Colors.green.withOpacity(0.1)
              : Colors.red.withOpacity(0.1),
          child: Icon(
            isIncome ? Icons.arrow_upward : Icons.arrow_downward,
            color: isIncome ? Colors.green : Colors.red,
          ),
        ),
        title: Text(
          transaction.category.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (transaction.description != null && transaction.description!.isNotEmpty)
              Text(transaction.description!),
            Text(
              DateFormat('dd/MM/yyyy').format(transaction.transactionDate),
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
        trailing: Text(
          '${isIncome ? '+' : '-'}${_formatCurrency(transaction.amount)}',
          style: TextStyle(
            color: isIncome ? Colors.green : Colors.red,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        onLongPress: () => _deleteTransaction(transaction.id),
      ),
    );
  }
}
