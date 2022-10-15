import '../../base_model.dart';

class AuthRequest implements BaseModel {
  String? username;
  String? password;

  AuthRequest({
    this.username,
    this.password,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      'user_name': username,
      'password': password,
    };
  }
}