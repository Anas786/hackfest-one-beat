import '../../../data/models/entities/facility.dart';

import '../../../../data/models/entities/appointment.dart';
import '../../../../data/models/network/result.dart';
import '../../../../di/injector.dart';
import '../../../data/repositories/entities/facility_repository.dart';
import '../base_view_model.dart';

class FacilityViewModel extends BaseViewModel {
  var _repository = injector<FacilityRepository>();

  set repository(FacilityRepository repository) {
    _repository = repository;
  }

  List<Facility>? _facilities;
  List<Facility>? get facilities => _facilities;

  Future<Result<List<Facility>>> getFacilities() async {
    toggleLoading(true);
    final result = await _repository.getFacilities();
    _facilities = result.data;
    toggleLoading(false);
    notifyListeners();
    return result;
  }
}
