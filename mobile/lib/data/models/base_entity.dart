import 'base_model.dart';

class BaseEntity implements BaseModel {
  String? id;
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
      json['_id'] = id;
    }
    if (createdAt != null) {
      json['createdAt'] = createdAt?.toIso8601String();
    }
    if (updatedAt != null) {
      json['updatedAt'] = updatedAt?.toIso8601String();
    }
    return json;
  }
}
