import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _isLoggedIn = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _isLoggedIn;

  Future<void> checkLoginStatus() async {
    _isLoggedIn = await _authService.isLoggedIn();
    if (_isLoggedIn) {
      await loadProfile();
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final response = await _authService.login(email, password);

    _isLoading = false;

    if (response.success && response.data != null) {
      _isLoggedIn = true;
      // Load full profile after login
      await loadProfile();
      notifyListeners();
      return true;
    }

    _error = response.message;
    notifyListeners();
    return false;
  }

  Future<bool> register(
    String email,
    String password,
    String fullName,
    String? phoneNumber,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final response = await _authService.register(
      email,
      password,
      fullName,
      phoneNumber,
    );

    _isLoading = false;

    if (response.success) {
      notifyListeners();
      return true;
    }

    _error = response.message;
    notifyListeners();
    return false;
  }

  Future<void> loadProfile() async {
    final response = await _authService.getProfile();
    if (response.success && response.data != null) {
      _user = response.data;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
