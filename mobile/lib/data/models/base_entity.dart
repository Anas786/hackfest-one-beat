import 'base_model.dart';

class BaseEntity implements BaseModel {
  int? id;
  String? createdAt;
  String? updatedAt;

  BaseEntity({
    this.id,
    this.createdAt,
    this.updatedAt,
  });

  @override
  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (id != null) {
      json['id'] = id;
    }
    if (createdAt != null) {
      json['created_at'] = createdAt;
    }
    if (updatedAt != null) {
      json['updated_at'] = updatedAt;
    }
    return json;
  }
}
