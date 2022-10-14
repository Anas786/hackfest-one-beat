import '../base_model.dart';

class PageArguments implements BaseModel {
  dynamic data;

  PageArguments({
    this.data,
  });

  @override
  Map<String, dynamic> toJson() {
    return {'Data': _getData()};
  }

  dynamic _getData() {
    if (data is BaseModel) {
      return '$data=${(data as BaseModel).toJson()}';
    }
    if (data is Map<String, dynamic>) {
      final map = data as Map<String, dynamic>?;
      return map?.entries.map((entry) {
        if (entry.value is BaseModel) {
          return '${entry.key}=${(entry.value as BaseModel).toJson()}';
        } else if (entry.value is List<BaseModel>) {
          return '${entry.key}=${(entry.value as List<BaseModel>).map((x) => x.toJson()).toList()}';
        } else {
          return '${entry.key}=${entry.value}';
        }
      });
    }
    return data;
  }
}
