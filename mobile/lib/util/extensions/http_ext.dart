import 'package:http/http.dart' as http;

import '../../data/models/network/result.dart';

extension HttpExtension on http.Response? {
  Result<T> parse<T>(Function(dynamic data) callback) {
    final code = this?.statusCode;
    final body = this?.body;
    try {
      Result<T> result = Result.parse(_getGenericResponse(body), code, (data) => callback(data));
      result.message ??= '$code - ${this!.reasonPhrase}';
      return result;
    } catch (e) {
      return Result.fromError(e);
    }
  }

  String _getGenericResponse(String? body) {
    /*
    * Use this method only if your BE doesn't provide a generic response for each API.
    * Below are the desired response formats for success/error scenarios
    *
    * { "success": true, "data": {} }
    * { "success": false, "message": "" }
    *
    */

    const start = '{"success":true,"data":';
    const end = '}';
    return '$start$body$end';
  }
}
