import '../../../util/utilities/datetime_utils.dart';
import '../base_entity.dart';

class User extends BaseEntity {
  @override
  final String? id;
  final String? name;
  final String? email;
  @override
  final DateTime? createdAt;

  User({
    this.id,
    this.name,
    this.email,
    this.createdAt,
  }) : super(id: id, createdAt: createdAt);

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      createdAt: DateTimeUtils.parse(json['createdAt']),
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json['name'] = name;
    json['email'] = email;
    return json;
  }
}
