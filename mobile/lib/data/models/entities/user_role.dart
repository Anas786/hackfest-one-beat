import '../base_entity.dart';

class UserRole extends BaseEntity {
  @override
  int? id;
  String? name;
  String? code;
  int? categoryId;

  UserRole({
    this.id,
    this.name,
    this.code,
    this.categoryId,
  });

  UserRole.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    code = json['code'];
    categoryId = json['category_id'];
  }

  @override
  Map<String, dynamic> toJson() {
    final data = super.toJson();
    data['name'] = name;
    data['code'] = code;
    data['category_id'] = categoryId;
    return data;
  }
}
