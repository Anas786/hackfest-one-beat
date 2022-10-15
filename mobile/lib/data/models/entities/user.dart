import '../base_entity.dart';
import 'user_category.dart';
import 'user_role.dart';

class User extends BaseEntity {
  @override
  int? id;
  String? firstName;
  String? middleName;
  String? lastName;
  String? userName;
  String? email;
  String? phone;
  UserRole? role;
  UserCategory? category;

  User({
    this.id,
    this.firstName,
    this.middleName,
    this.lastName,
    this.userName,
    this.email,
    this.phone,
    this.role,
    this.category,
  });

  User.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['first_name'];
    middleName = json['middle_name'];
    lastName = json['last_name'];
    userName = json['user_name'];
    email = json['email'];
    phone = json['phone'];
    role = json['role'] != null
        ? UserRole.fromJson(json['role'])
        : null;
    category = json['category'] != null
        ? UserCategory.fromJson(json['category'])
        : null;
  }

  @override
  Map<String, dynamic> toJson() {
    final data = super.toJson();
    data['first_name'] = firstName;
    data['middle_name'] = middleName;
    data['last_name'] = lastName;
    data['user_name'] = userName;
    data['email'] = email;
    data['phone'] = phone;
    if (role != null) {
      data['role'] = role!.toJson();
    }
    if (category != null) {
      data['category'] = category!.toJson();
    }
    return data;
  }
}
