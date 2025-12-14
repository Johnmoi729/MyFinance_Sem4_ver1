import 'package:flutter/material.dart';

class PersonalizedGreeting extends StatelessWidget {
  final String userName;

  const PersonalizedGreeting({
    super.key,
    required this.userName,
  });

  String _getGreeting() {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      return 'Chào buổi sáng';
    } else if (hour >= 12 && hour < 18) {
      return 'Chào buổi chiều';
    } else {
      return 'Chào buổi tối';
    }
  }

  IconData _getGreetingIcon() {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      return Icons.wb_sunny;
    } else if (hour >= 12 && hour < 18) {
      return Icons.wb_twilight;
    } else {
      return Icons.nightlight_round;
    }
  }

  Color _getGreetingColor() {
    final hour = DateTime.now().hour;

    if (hour >= 5 && hour < 12) {
      return Colors.amber;
    } else if (hour >= 12 && hour < 18) {
      return Colors.orange;
    } else {
      return Colors.indigo;
    }
  }

  @override
  Widget build(BuildContext context) {
    final greeting = _getGreeting();
    final icon = _getGreetingIcon();
    final color = _getGreetingColor();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.1),
            color.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            size: 32,
            color: color,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  greeting,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  userName.isNotEmpty ? userName : 'Người dùng',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
