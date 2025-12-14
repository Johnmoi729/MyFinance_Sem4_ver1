import 'package:flutter/material.dart';
import '../../models/budget_settings.dart';
import '../../services/budget_service.dart';

class BudgetSettingsScreen extends StatefulWidget {
  const BudgetSettingsScreen({super.key});

  @override
  State<BudgetSettingsScreen> createState() => _BudgetSettingsScreenState();
}

class _BudgetSettingsScreenState extends State<BudgetSettingsScreen> {
  final BudgetService _budgetService = BudgetService();

  BudgetSettings? _settings;
  bool _isLoading = true;
  bool _isSaving = false;

  double _warningThreshold = 75.0;
  double _criticalThreshold = 90.0;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    setState(() => _isLoading = true);

    final response = await _budgetService.getBudgetSettings();
    if (response.success && response.data != null) {
      _settings = response.data;
      setState(() {
        _warningThreshold = _settings!.warningThreshold;
        _criticalThreshold = _settings!.criticalThreshold;
      });
    }

    setState(() => _isLoading = false);
  }

  Future<void> _saveSettings() async {
    setState(() => _isSaving = true);

    final updatedSettings = BudgetSettings(
      id: _settings?.id ?? 0,
      userId: _settings?.userId ?? 0,
      warningThreshold: _warningThreshold,
      criticalThreshold: _criticalThreshold,
    );

    final response = await _budgetService.updateBudgetSettings(updatedSettings);

    if (!mounted) return;

    setState(() => _isSaving = false);

    if (response.success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cập nhật cài đặt thành công'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.message),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _resetSettings() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Đặt lại cài đặt'),
        content: const Text('Bạn có chắc muốn đặt lại về giá trị mặc định?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Đặt lại'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() => _isSaving = true);

      final response = await _budgetService.resetBudgetSettings();

      if (!mounted) return;

      setState(() => _isSaving = false);

      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đã đặt lại cài đặt về mặc định'),
            backgroundColor: Colors.green,
          ),
        );
        _loadSettings();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt Ngân sách'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _isSaving ? null : _resetSettings,
            tooltip: 'Đặt lại mặc định',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Info card
                  Card(
                    color: Colors.blue.withValues(alpha: 0.1),
                    child: const Padding(
                      padding: EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.blue),
                          SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Cấu hình ngưỡng cảnh báo để nhận thông báo khi chi tiêu vượt mức',
                              style: TextStyle(color: Colors.blue),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Warning Threshold
                  const Text(
                    'Ngưỡng Cảnh Báo',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Cảnh báo khi chi tiêu đạt:'),
                              Text(
                                '${_warningThreshold.toStringAsFixed(0)}%',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange,
                                ),
                              ),
                            ],
                          ),
                          Slider(
                            value: _warningThreshold,
                            min: 50,
                            max: 100,
                            divisions: 50,
                            label: '${_warningThreshold.toStringAsFixed(0)}%',
                            activeColor: Colors.orange,
                            onChanged: (value) {
                              setState(() {
                                _warningThreshold = value;
                                // Ensure critical is always >= warning
                                if (_criticalThreshold < _warningThreshold) {
                                  _criticalThreshold = _warningThreshold;
                                }
                              });
                            },
                          ),
                          Text(
                            'Bạn sẽ nhận cảnh báo khi chi tiêu đạt ${_warningThreshold.toStringAsFixed(0)}% ngân sách',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Critical Threshold
                  const Text(
                    'Ngưỡng Nguy Hiểm',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Cảnh báo nguy hiểm khi đạt:'),
                              Text(
                                '${_criticalThreshold.toStringAsFixed(0)}%',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                            ],
                          ),
                          Slider(
                            value: _criticalThreshold,
                            min: _warningThreshold,
                            max: 100,
                            divisions: (100 - _warningThreshold).toInt(),
                            label: '${_criticalThreshold.toStringAsFixed(0)}%',
                            activeColor: Colors.red,
                            onChanged: (value) {
                              setState(() => _criticalThreshold = value);
                            },
                          ),
                          Text(
                            'Cảnh báo mức độ cao khi chi tiêu đạt ${_criticalThreshold.toStringAsFixed(0)}% ngân sách',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Notifications Section
                  const Text(
                    'Thông Báo',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Info message directing users to User Preferences
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      border: Border.all(color: Colors.blue.shade200),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.info_outline,
                          color: Colors.blue.shade700,
                          size: 24
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Quản lý thông báo email',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade900,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Để bật/tắt thông báo email (cảnh báo ngân sách, tóm tắt tháng, v.v.), vui lòng vào Cài đặt → Tùy chỉnh cá nhân.',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.blue.shade800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Save Button
                  ElevatedButton(
                    onPressed: _isSaving ? null : _saveSettings,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: _isSaving
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Lưu cài đặt',
                            style: TextStyle(fontSize: 16)),
                  ),
                ],
              ),
            ),
    );
  }
}
