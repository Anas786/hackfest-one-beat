import 'auth_request.dart';

class PatientRequest extends AuthRequest {
  @override
  String? username;
  String? firstName;
  String? lastName;
  String? email;
  @override
  String? password;
  String? dateOfBirth;
  String? gender;
  String? identityNumber;
  String? phone;

  PatientRequest({
    this.username,
    this.firstName,
    this.lastName,
    this.email,
    this.password,
    this.dateOfBirth,
    this.gender,
    this.identityNumber,
    this.phone,
  }) : super(username: username, password: password);

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json['first_name'] = firstName;
    json['last_name'] = lastName;
    json['email'] = email;
    json['dob'] = dateOfBirth;
    json['gender'] = gender;
    json['nic'] = identityNumber;
    json['phone'] = phone;
    return json;
  }
}
