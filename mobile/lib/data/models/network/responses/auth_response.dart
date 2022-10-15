import '../../base_model.dart';
import '../../entities/token.dart';
import '../../entities/user.dart';

class AuthResponse implements BaseModel {
  User? user;
  Token? token;

  AuthResponse({this.user, this.token});

  AuthResponse.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? User.fromJson(json['user']) : null;
    token = json['token'] != null ? Token.fromJson(json['token']) : null;
  }

  @override
  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    if (user != null) {
      data['user'] = user!.toJson();
    }
    if (token != null) {
      data['token'] = token!.toJson();
    }
    return data;
  }
}
