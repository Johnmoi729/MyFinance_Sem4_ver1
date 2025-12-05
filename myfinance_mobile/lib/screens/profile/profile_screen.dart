import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Đăng xuất'),
                  content: const Text('Bạn có chắc muốn đăng xuất?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: const Text('Hủy'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context, true),
                      child: const Text('Đăng xuất'),
                    ),
                  ],
                ),
              );

              if (confirm == true && context.mounted) {
                await authProvider.logout();
                if (context.mounted) {
                  Navigator.pushReplacementNamed(context, '/login');
                }
              }
            },
          ),
        ],
      ),
      body: user == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Profile header card
                  Card(
                    elevation: 4,
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Theme.of(context).primaryColor.withValues(alpha: 0.1),
                            child: Icon(
                              Icons.person,
                              size: 60,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            user.fullName ?? 'Người dùng',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user.email,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Info section
                  const Text(
                    'Thông tin cá nhân',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),

                  Card(
                    child: Column(
                      children: [
                        _buildInfoTile(
                          Icons.email,
                          'Email',
                          user.email,
                        ),
                        const Divider(height: 1),
                        _buildInfoTile(
                          Icons.phone,
                          'Số điện thoại',
                          user.phoneNumber ?? 'Chưa cập nhật',
                        ),
                        const Divider(height: 1),
                        _buildInfoTile(
                          Icons.location_on,
                          'Địa chỉ',
                          user.address ?? 'Chưa cập nhật',
                        ),
                        const Divider(height: 1),
                        _buildInfoTile(
                          Icons.cake,
                          'Ngày sinh',
                          user.dateOfBirth != null
                              ? DateFormat('dd/MM/yyyy').format(user.dateOfBirth!)
                              : 'Chưa cập nhật',
                        ),
                        const Divider(height: 1),
                        _buildInfoTile(
                          Icons.access_time,
                          'Đăng nhập lần cuối',
                          user.lastLogin != null
                              ? DateFormat('dd/MM/yyyy HH:mm').format(user.lastLogin!)
                              : 'Chưa xác định',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Action buttons
                  ElevatedButton.icon(
                    onPressed: () async {
                      final result = await Navigator.pushNamed(
                        context,
                        '/profile/edit',
                      );
                      if (result == true) {
                        authProvider.loadProfile();
                      }
                    },
                    icon: const Icon(Icons.edit),
                    label: const Text('Chỉnh sửa thông tin'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                  const SizedBox(height: 12),

                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/profile/change-password');
                    },
                    icon: const Icon(Icons.lock),
                    label: const Text('Đổi mật khẩu'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[600]),
      title: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          color: Colors.grey[600],
        ),
      ),
      subtitle: Text(
        value,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Colors.black87,
        ),
      ),
    );
  }
}
