class ApiConfig {
  // Change this to your backend URL
  // For Flutter Web: localhost (same machine)
  // For Android emulator: 10.0.2.2 (localhost equivalent)
  // For iOS simulator: localhost or 127.0.0.1
  // For real device: your computer's IP address (e.g., 192.168.1.3)
  static const String baseUrl = 'http://localhost:8080/api';

  // Timeout settings
  static const int connectTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
}
