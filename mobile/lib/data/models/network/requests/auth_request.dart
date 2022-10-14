import '../../base_model.dart';

class AuthRequest implements BaseModel {
  String? email;
  String? password;

  AuthRequest({
    this.email,
    this.password,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class RegisterRequest extends AuthRequest {
  final String? firstName;
  final String? lastName;
  final String? dateOfBirth;
  final String? gender;
  final String? identityNumber;
  @override
  final String? email;
  final String? phone;
  final String? transportationMode;
  final String? bedType;
  @override
  final String? password;

  RegisterRequest({
    this.firstName,
    this.lastName,
    this.dateOfBirth,
    this.gender,
    this.identityNumber,
    this.email,
    this.phone,
    this.transportationMode,
    this.bedType,
    this.password,
  }) : super(email: email, password: password);

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json['first_name'] = firstName;
    json['last_name'] = lastName;
    json['dob'] = dateOfBirth;
    json['gender'] = gender;
    json['identity_number'] = identityNumber;
    json['phone'] = phone;
    json['transportation_mode'] = transportationMode;
    json['bed_type'] = bedType;
    return json;
  }
}
