import '../base_model.dart';

class Token implements BaseModel {
  String? type;
  String? token;
  String? expiresAt;

  Token({this.type, this.token, this.expiresAt});

  Token.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    token = json['token'];
    expiresAt = json['expires_at'];
  }

  @override
  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    data['type'] = type;
    data['token'] = token;
    data['expires_at'] = expiresAt;
    return data;
  }
}