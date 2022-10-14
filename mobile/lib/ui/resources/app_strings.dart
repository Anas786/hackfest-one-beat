class AppStrings {
  const AppStrings._internal();

  static const String appName = 'One Beat';

  // Pages
  static const String titleHome = 'Home';

  // Success
  static const String successLogin = 'Login successful!';

  // Errors
  static const String error = 'Error';
  static const String errorGeneral = 'Something went wrong, please try again.';
  static const String errorUnauthorized = 'Your session has been expired. Please re-login to continue using the app.';
  static const String errorTimeout = 'We\'re currently experiencing technical issues, please try again.';
  static const String errorInternetUnavailable = 'Please check your internet connection and try again.';
  static const String errorUnknown = 'An unknown error has occurred, please try again.';

  // Input fields & validation
  static const String labelEmail = 'Email Address';
  static const String labelPassword = 'Password';
  static const String validationRequired = 'This is a required field.';
  static const String validationInvalidEmail = 'Please enter a valid email address.';
  static const String validationInvalidPassword = 'Password must be at least 8 characters long.';
  static const String validationPasswordsNotMatch = 'Passwords do not match.';

  // General
  static const String ok = 'OK';
  static const String cancel = 'Cancel';
  static const String exit = 'Exit';
  static const String exitMessage = 'Are you sure you want to exit the application?';
  static const String loadingText = 'Please wait...';
  static const String login = 'Log in';
  static const String logout = 'Log out';
}