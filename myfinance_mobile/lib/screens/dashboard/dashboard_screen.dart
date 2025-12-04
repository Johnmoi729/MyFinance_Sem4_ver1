import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../services/transaction_service.dart';
import '../../services/budget_service.dart';
import '../../models/transaction.dart';
import '../../models/budget.dart';
import '../../models/category.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final TransactionService _transactionService = TransactionService();
  final BudgetService _budgetService = BudgetService();

  List<Transaction> _recentTransactions = [];
  List<BudgetUsage> _budgetUsage = [];
  bool _isLoading = true;
  double _totalIncome = 0;
  double _totalExpense = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    // Load recent transactions
    final transactionsResponse = await _transactionService.getRecentTransactions();
    if (transactionsResponse.success && transactionsResponse.data != null) {
      _recentTransactions = transactionsResponse.data!;
    }

    // Load all transactions for summary
    final allTransactionsResponse = await _transactionService.getTransactions();
    if (allTransactionsResponse.success && allTransactionsResponse.data != null) {
      _totalIncome = allTransactionsResponse.data!
          .where((t) => t.type == TransactionType.INCOME)
          .fold(0.0, (sum, t) => sum + t.amount);
      _totalExpense = allTransactionsResponse.data!
          .where((t) => t.type == TransactionType.EXPENSE)
          .fold(0.0, (sum, t) => sum + t.amount);
    }

    // Load budget usage
    final budgetResponse = await _budgetService.getCurrentMonthUsage();
    if (budgetResponse.success && budgetResponse.data != null) {
      _budgetUsage = budgetResponse.data!;
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

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('MyFinance'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              if (mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Greeting
                    Text(
                      '${_getGreeting()}, ${user?.fullName ?? 'bạn'}!',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Summary cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildSummaryCard(
                            'Thu nhập',
                            _formatCurrency(_totalIncome),
                            Colors.green,
                            Icons.arrow_upward,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            'Chi tiêu',
                            _formatCurrency(_totalExpense),
                            Colors.red,
                            Icons.arrow_downward,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildSummaryCard(
                      'Số dư',
                      _formatCurrency(_totalIncome - _totalExpense),
                      Colors.blue,
                      Icons.account_balance_wallet,
                    ),
                    const SizedBox(height: 24),

                    // Budget usage section
                    if (_budgetUsage.isNotEmpty) ...[
                      const Text(
                        'Ngân sách tháng này',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ..._budgetUsage.take(3).map((usage) => _buildBudgetCard(usage)),
                      const SizedBox(height: 24),
                    ],

                    // Recent transactions
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Giao dịch gần đây',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/transactions');
                          },
                          child: const Text('Xem tất cả'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (_recentTransactions.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: Text('Chưa có giao dịch nào'),
                        ),
                      )
                    else
                      ..._recentTransactions
                          .take(5)
                          .map((t) => _buildTransactionTile(t)),
                  ],
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/transactions/add');
        },
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              break; // Already on dashboard
            case 1:
              Navigator.pushNamed(context, '/transactions');
              break;
            case 2:
              Navigator.pushNamed(context, '/budgets');
              break;
            case 3:
              Navigator.pushNamed(context, '/categories');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Tổng quan',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Giao dịch',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pie_chart),
            label: 'Ngân sách',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: 'Danh mục',
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(
    String title,
    String amount,
    Color color,
    IconData icon,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    amount,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBudgetCard(BudgetUsage usage) {
    Color statusColor;
    switch (usage.status) {
      case 'SAFE':
        statusColor = Colors.green;
        break;
      case 'WARNING':
        statusColor = Colors.orange;
        break;
      case 'CRITICAL':
      case 'OVER_BUDGET':
        statusColor = Colors.red;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  usage.categoryName,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  '${usage.usagePercentage.toStringAsFixed(0)}%',
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: (usage.usagePercentage / 100).clamp(0.0, 1.0),
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation(statusColor),
            ),
            const SizedBox(height: 4),
            Text(
              '${_formatCurrency(usage.actualSpent)} / ${_formatCurrency(usage.budgetAmount)}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionTile(Transaction transaction) {
    final isIncome = transaction.type == TransactionType.INCOME;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
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
        title: Text(transaction.category.name),
        subtitle: Text(
          transaction.description ?? DateFormat('dd/MM/yyyy').format(transaction.transactionDate),
        ),
        trailing: Text(
          '${isIncome ? '+' : '-'}${_formatCurrency(transaction.amount)}',
          style: TextStyle(
            color: isIncome ? Colors.green : Colors.red,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
