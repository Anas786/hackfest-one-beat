import '../base_entity.dart';

class Doctor extends BaseEntity {
  @override
  int? id;
  String? mrNumber;
  String? firstName;
  String? middleName;
  String? lastName;
  String? userName;
  String? email;
  String? nic;
  String? phone;
  int? categoryId;
  String? gender;
  String? dob;
  int? roleId;
  int? facilityId;

  Doctor({
    this.id,
    this.mrNumber,
    this.firstName,
    this.middleName,
    this.lastName,
    this.userName,
    this.email,
    this.nic,
    this.phone,
    this.categoryId,
    this.gender,
    this.dob,
    this.roleId,
    this.facilityId,
  }) : super(id: id);

  String get fullName {
    if (middleName?.isNotEmpty == true) {
      return '$firstName $middleName $lastName';
    }
    return '$firstName $lastName';
  }

  Doctor.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    mrNumber = json['mr_number'];
    firstName = json['first_name'];
    middleName = json['middle_name'];
    lastName = json['last_name'];
    userName = json['user_name'];
    email = json['email'];
    nic = json['nic'];
    phone = json['phone'];
    categoryId = json['category_id'];
    gender = json['gender'];
    dob = json['dob'];
    roleId = json['role_id'];
    facilityId = json['facility_id'];
  }

  @override
  Map<String, dynamic> toJson() {
    final data = super.toJson();
    data['mr_number'] = mrNumber;
    data['first_name'] = firstName;
    data['middle_name'] = middleName;
    data['last_name'] = lastName;
    data['user_name'] = userName;
    data['email'] = email;
    data['nic'] = nic;
    data['phone'] = phone;
    data['category_id'] = categoryId;
    data['gender'] = gender;
    data['dob'] = dob;
    data['role_id'] = roleId;
    data['facility_id'] = facilityId;
    return data;
  }
}
