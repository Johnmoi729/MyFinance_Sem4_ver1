class User {
  final int id;
  final String email;
  final String? fullName;
  final String? phoneNumber;
  final String? address;
  final DateTime? dateOfBirth;
  final String? avatar;
  final bool? isActive;
  final bool? isEmailVerified;
  final DateTime? lastLogin;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final List<String>? roles;

  User({
    required this.id,
    required this.email,
    this.fullName,
    this.phoneNumber,
    this.address,
    this.dateOfBirth,
    this.avatar,
    this.isActive,
    this.isEmailVerified,
    this.lastLogin,
    this.createdAt,
    this.updatedAt,
    this.roles,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      fullName: json['fullName'],
      phoneNumber: json['phoneNumber'],
      address: json['address'],
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'])
          : null,
      avatar: json['avatar'],
      isActive: json['isActive'],
      isEmailVerified: json['isEmailVerified'],
      lastLogin: json['lastLogin'] != null
          ? DateTime.parse(json['lastLogin'])
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      roles: json['roles'] != null
          ? List<String>.from(json['roles'])
          : null,
    );
  }
}

class LoginResponse {
  final String token;
  final String type;
  final int id;
  final String email;
  final String? fullName;
  final String? phoneNumber;
  final DateTime? lastLogin;
  final int? expiresIn;
  final List<String>? roles;

  LoginResponse({
    required this.token,
    required this.type,
    required this.id,
    required this.email,
    this.fullName,
    this.phoneNumber,
    this.lastLogin,
    this.expiresIn,
    this.roles,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      token: json['token'],
      type: json['type'] ?? 'Bearer',
      id: json['id'],
      email: json['email'],
      fullName: json['fullName'],
      phoneNumber: json['phoneNumber'],
      lastLogin: json['lastLogin'] != null
          ? DateTime.parse(json['lastLogin'])
          : null,
      expiresIn: json['expiresIn'],
      roles: json['roles'] != null
          ? List<String>.from(json['roles'])
          : null,
    );
  }
}
