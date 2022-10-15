import 'base_model.dart';

class BaseEntity implements BaseModel {
  int? id;
  DateTime? createdAt;
  DateTime? updatedAt;

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
      json['created_at'] = createdAt!.toIso8601String();
    }
    if (updatedAt != null) {
      json['updated_at'] = updatedAt!.toIso8601String();
    }
    return json;
  }
}
