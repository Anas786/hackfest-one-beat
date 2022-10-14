import 'package:logger/logger.dart';

class LogUtils {
  const LogUtils._internal();

  static Logger? _logger;

  static void init() {
    _logger = Logger(
      printer: PrettyPrinter(printTime: true),
    );
  }

  static void debug(dynamic message) {
    _logger?.d(message);
  }

  static void info(dynamic message) {
    _logger?.i(message);
  }

  static void error(dynamic message) {
    _logger?.e(message);
  }
}
