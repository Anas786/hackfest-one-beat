import '../../base_model.dart';

class AuthRequest implements BaseModel {
  final String? email;
  final String? password;

  AuthRequest({
    required this.email,
    required this.password,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class RegisterRequest extends AuthRequest {
  final String? name;
  @override
  final String? email;
  @override
  final String? password;

  RegisterRequest({
    required this.name,
    required this.email,
    required this.password,
  }) : super(email: email, password: password);

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json['name'] = name;
    return json;
  }
}
