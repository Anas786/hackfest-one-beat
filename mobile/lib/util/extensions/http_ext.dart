import 'package:http/http.dart' as http;

import '../../data/models/network/result.dart';

extension HttpExtension on http.Response? {
  Result<T> parse<T>(Function(dynamic data) callback) {
    final code = this?.statusCode;
    final body = this?.body;
    try {
      Result<T> result = Result.parse(body, code, (data) => callback(data));
      result.message ??= '$code - ${this!.reasonPhrase}';
      return result;
    } catch (e) {
      return Result.fromError(e);
    }
  }
}
