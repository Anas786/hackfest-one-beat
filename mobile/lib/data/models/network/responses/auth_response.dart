import '../../base_model.dart';
import '../../entities/user.dart';

class AuthResponse implements BaseModel {
  User? user;
  String? token;

  AuthResponse({
    required this.user,
    required this.token,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: json['user'] == null ? null : User.fromJson(json['user']),
      token: json['token'],
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      'user': user?.toJson(),
      'token': token,
    };
  }
}
