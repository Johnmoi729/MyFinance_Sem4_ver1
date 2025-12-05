import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/transaction.dart';
import '../../models/category.dart';
import '../../services/transaction_service.dart';

class TransactionDetailScreen extends StatelessWidget {
  final Transaction transaction;

  const TransactionDetailScreen({
    super.key,
    required this.transaction,
  });

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  Future<void> _deleteTransaction(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: const Text('Bạn có chắc muốn xóa giao dịch này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );

    if (confirm == true && context.mounted) {
      final service = TransactionService();
      final response = await service.deleteTransaction(transaction.id);

      if (context.mounted) {
        if (response.success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đã xóa giao dịch'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true); // Return true to refresh list
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(response.message),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction.type == TransactionType.INCOME;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết giao dịch'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () async {
              final result = await Navigator.pushNamed(
                context,
                '/transactions/edit',
                arguments: transaction,
              );
              if (result == true && context.mounted) {
                Navigator.pop(context, true);
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () => _deleteTransaction(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Amount card
            Card(
              color: isIncome ? Colors.green.shade50 : Colors.red.shade50,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Icon(
                      isIncome ? Icons.arrow_upward : Icons.arrow_downward,
                      size: 48,
                      color: isIncome ? Colors.green : Colors.red,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isIncome ? 'Thu nhập' : 'Chi tiêu',
                      style: TextStyle(
                        color: isIncome ? Colors.green : Colors.red,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _formatCurrency(transaction.amount),
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: isIncome ? Colors.green : Colors.red,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Details
            _buildDetailRow('Danh mục', transaction.category.name),
            const Divider(),
            _buildDetailRow(
              'Ngày giao dịch',
              DateFormat('dd/MM/yyyy').format(transaction.transactionDate),
            ),
            const Divider(),
            if (transaction.description != null &&
                transaction.description!.isNotEmpty) ...[
              _buildDetailRow('Ghi chú', transaction.description!),
              const Divider(),
            ],
            _buildDetailRow(
              'Ngày tạo',
              transaction.createdAt != null
                  ? DateFormat('dd/MM/yyyy HH:mm').format(transaction.createdAt!)
                  : '-',
            ),
            if (transaction.updatedAt != null &&
                transaction.createdAt != transaction.updatedAt) ...[
              const Divider(),
              _buildDetailRow(
                'Cập nhật lần cuối',
                DateFormat('dd/MM/yyyy HH:mm').format(transaction.updatedAt!),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
