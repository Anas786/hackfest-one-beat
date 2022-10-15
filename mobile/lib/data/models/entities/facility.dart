import '../base_entity.dart';

class Facility extends BaseEntity {
  @override
  int? id;
  String? name;
  String? address;
  String? address2;
  String? zip;
  String? city;
  String? state;
  int? countryId;
  String? latitude;
  String? longitude;
  int? facilityTypeId;
  String? phone;
  String? email;
  String? representativeName;
  String? representativePhone;
  String? representativeEmail;

  Facility({
    this.id,
    this.name,
    this.address,
    this.address2,
    this.zip,
    this.city,
    this.state,
    this.countryId,
    this.latitude,
    this.longitude,
    this.facilityTypeId,
    this.phone,
    this.email,
    this.representativeName,
    this.representativePhone,
    this.representativeEmail,
  }) : super(id: id);

  static List<Facility>? fromJsonAsList(dynamic data) {
    if (data == null) {
      return null;
    }
    return List<Facility>.from(data.map((x) => Facility.fromJson(x)));
  }

  Facility.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    address = json['address'];
    address2 = json['address2'];
    zip = json['zip'];
    city = json['city'];
    state = json['state'];
    countryId = json['country_id'];
    latitude = json['latitude'];
    longitude = json['longitude'];
    facilityTypeId = json['facility_type_id'];
    phone = json['phone'];
    email = json['email'];
    representativeName = json['representative_name'];
    representativePhone = json['representative_phone'];
    representativeEmail = json['representative_email'];
  }

  @override
  Map<String, dynamic> toJson() {
    final data = super.toJson();
    data['name'] = name;
    data['address'] = address;
    data['address2'] = address2;
    data['zip'] = zip;
    data['city'] = city;
    data['state'] = state;
    data['country_id'] = countryId;
    data['latitude'] = latitude;
    data['longitude'] = longitude;
    data['facility_type_id'] = facilityTypeId;
    data['phone'] = phone;
    data['email'] = email;
    data['representative_name'] = representativeName;
    data['representative_phone'] = representativePhone;
    data['representative_email'] = representativeEmail;
    return data;
  }
}
