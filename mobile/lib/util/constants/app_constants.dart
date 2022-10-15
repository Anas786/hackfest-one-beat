class AppConstants {
  const AppConstants._internal();

  static const apiTimeout = 60; // Seconds
  static const supportUrl = 'http://app.getonebeat.com/';

  // Argument keys
  static const argUser = 'arg_user';

  // Shared preferences
  static const prefAuthToken = 'pref_token';
  static const prefAuthUser = 'pref_user';

  // Date formats
  static const String readableDayFormat = 'dd MMM, yyyy';
  static const String readableTimeFormat = 'hh:mm a';
  static const dateRequestFormat = 'yyy-MM-dd';
}
