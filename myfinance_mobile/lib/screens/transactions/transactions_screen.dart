import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/transaction_service.dart';
import '../../models/transaction.dart';
import '../../models/category.dart';
import 'transaction_detail_screen.dart';

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
  DateTime? _startDate;
  DateTime? _endDate;
  bool _isSearching = false;
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadTransactions() async {
    setState(() => _isLoading = true);

    // Use search if query is not empty
    final response = _searchQuery.isNotEmpty
        ? await _transactionService.searchTransactions(_searchQuery)
        : await _transactionService.getTransactions(type: _filterType);

    if (response.success && response.data != null) {
      // Apply date range filter on client side
      _transactions = response.data!;
      if (_startDate != null && _endDate != null) {
        _transactions = _transactions.where((t) {
          return t.transactionDate.isAfter(_startDate!.subtract(const Duration(days: 1))) &&
                 t.transactionDate.isBefore(_endDate!.add(const Duration(days: 1)));
        }).toList();
      }
      // Apply type filter when searching
      if (_searchQuery.isNotEmpty && _filterType != null) {
        _transactions = _transactions.where((t) => t.type == _filterType).toList();
      }
    }

    setState(() => _isLoading = false);
  }

  void _performSearch(String query) {
    setState(() {
      _searchQuery = query;
    });
    _loadTransactions();
  }

  Future<void> _showDateRangeFilter() async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Lọc theo ngày'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Quick filters
            ListTile(
              title: const Text('Tuần này'),
              onTap: () {
                final now = DateTime.now();
                final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
                setState(() {
                  _startDate = DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
                  _endDate = DateTime.now();
                });
                Navigator.pop(context);
                _loadTransactions();
              },
            ),
            ListTile(
              title: const Text('Tháng này'),
              onTap: () {
                final now = DateTime.now();
                setState(() {
                  _startDate = DateTime(now.year, now.month, 1);
                  _endDate = DateTime.now();
                });
                Navigator.pop(context);
                _loadTransactions();
              },
            ),
            ListTile(
              title: const Text('Tháng trước'),
              onTap: () {
                final now = DateTime.now();
                final lastMonth = DateTime(now.year, now.month - 1);
                setState(() {
                  _startDate = DateTime(lastMonth.year, lastMonth.month, 1);
                  _endDate = DateTime(now.year, now.month, 0);
                });
                Navigator.pop(context);
                _loadTransactions();
              },
            ),
            const Divider(),
            ListTile(
              title: const Text('Tùy chỉnh...'),
              onTap: () async {
                Navigator.pop(context);
                final picked = await showDateRangePicker(
                  context: context,
                  firstDate: DateTime(2020),
                  lastDate: DateTime.now(),
                  initialDateRange: _startDate != null && _endDate != null
                      ? DateTimeRange(start: _startDate!, end: _endDate!)
                      : null,
                );
                if (picked != null) {
                  setState(() {
                    _startDate = picked.start;
                    _endDate = picked.end;
                  });
                  _loadTransactions();
                }
              },
            ),
            if (_startDate != null && _endDate != null)
              ListTile(
                title: const Text('Xóa bộ lọc'),
                onTap: () {
                  setState(() {
                    _startDate = null;
                    _endDate = null;
                  });
                  Navigator.pop(context);
                  _loadTransactions();
                },
              ),
          ],
        ),
      ),
    );
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

      if (!mounted) return;

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
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Tìm kiếm giao dịch...',
                  border: InputBorder.none,
                  hintStyle: TextStyle(color: Colors.white70),
                ),
                style: const TextStyle(color: Colors.white),
                onChanged: (value) {
                  if (value.isEmpty) {
                    _performSearch('');
                  }
                },
                onSubmitted: _performSearch,
              )
            : const Text('Giao dịch'),
        actions: [
          if (_isSearching)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                setState(() {
                  _isSearching = false;
                  _searchQuery = '';
                  _searchController.clear();
                });
                _loadTransactions();
              },
            )
          else ...[
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: () {
                setState(() {
                  _isSearching = true;
                });
              },
            ),
            IconButton(
              icon: Icon(
                Icons.date_range,
                color: _startDate != null && _endDate != null ? Colors.blue : null,
              ),
              onPressed: _showDateRangeFilter,
            ),
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
              ? Colors.green.withValues(alpha: 0.1)
              : Colors.red.withValues(alpha: 0.1),
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
        onTap: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TransactionDetailScreen(transaction: transaction),
            ),
          );
          if (result == true) {
            _loadTransactions();
          }
        },
        onLongPress: () => _deleteTransaction(transaction.id),
      ),
    );
  }
}
