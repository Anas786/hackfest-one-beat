import '../base_entity.dart';

class Patient extends BaseEntity {
  int? id;
  String? firstName;
  String? middleName;
  String? lastName;
  String? userName;
  String? email;
  String? phone;
  String? nic;
  String? gender;
  String? dob;
  String? mrNumber;
  int? roleId;
  int? categoryId;

  Patient({
    this.id,
    this.firstName,
    this.middleName,
    this.lastName,
    this.userName,
    this.email,
    this.phone,
    this.nic,
    this.gender,
    this.dob,
    this.mrNumber,
    this.roleId,
    this.categoryId,
  });

  String get fullName {
    if (middleName?.isNotEmpty == true) {
      return '$firstName $middleName $lastName';
    }
    return '$firstName $lastName';
  }

  Patient.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['first_name'];
    middleName = json['middle_name'];
    lastName = json['last_name'];
    userName = json['user_name'];
    email = json['email'];
    phone = json['phone'];
    nic = json['nic'];
    gender = json['gender'];
    dob = json['dob'];
    mrNumber = json['mr_number'];
    roleId = json['role_id'];
    categoryId = json['category_id'];
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
    data['nic'] = nic;
    data['gender'] = gender;
    data['dob'] = dob;
    data['mr_number'] = mrNumber;
    data['role_id'] = roleId;
    data['category_id'] = categoryId;
    return data;
  }
}
