import '../../base_model.dart';

class AuthRequest implements BaseModel {
  String? email;
  String? password;

  AuthRequest({
    this.email,
    this.password,
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
    this.name,
    this.email,
    this.password,
  }) : super(email: email, password: password);

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json['name'] = name;
    return json;
  }
}
