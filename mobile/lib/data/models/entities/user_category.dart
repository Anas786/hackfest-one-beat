import '../base_entity.dart';

class UserCategory extends BaseEntity {
  @override
  int? id;
  String? name;
  String? code;

  UserCategory({
    this.id,
    this.name,
    this.code,
  });

  UserCategory.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    code = json['code'];
  }

  @override
  Map<String, dynamic> toJson() {
    final data = super.toJson();
    data['name'] = name;
    data['code'] = code;
    return data;
  }
}
