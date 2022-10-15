class AppStrings {
  const AppStrings._internal();

  static const appName = 'OneBeat';

  // Pages
  static const titleHome = 'Home';

  // Success
  static const successLogin = 'Login successful!';

  // Errors
  static const error = 'Error';
  static const errorGeneral = 'Something went wrong, please try again.';
  static const errorUnauthorized = 'Your session has been expired. Please re-login to continue using the app.';
  static const errorTimeout = 'We\'re currently experiencing technical issues, please try again.';
  static const errorInternetUnavailable = 'Please check your internet connection and try again.';
  static const errorUnknown = 'An unknown error has occurred, please try again.';

  // Input fields & validation
  static const email = 'Email Address';
  static const emailOptional = 'Email Address (optional)';
  static const emailHint = 'Enter $email';
  static const password = 'Password';
  static const passwordHint = 'Enter $password';
  static const username = 'Username';
  static const usernameHint = 'Enter $username';
  static const name = 'Name';
  static const firstName = 'First Name';
  static const firstNameHint = 'Enter $firstName';
  static const lastName = 'Last Name';
  static const lastNameHint = 'Enter $lastName';
  static const dob = 'Date of Birth';
  static const gender = 'Gender';
  static const cnic = 'CNIC';
  static const cnicMask = '#####-#######-#';
  static const mobile = 'Mobile Number';
  static const mobileMask = '####-#######';
  static const select = 'Select';
  static const invalidEmail = 'Please enter a valid email address.';
  static const invalidPassword = 'Password must be at least 8 characters long.';
  static const passwordsNotMatch = 'Passwords do not match.';
  static const invalidCNIC = 'Please enter a valid CNIC.';
  static const invalidMobileNumber = 'Please enter a valid mobile number.';

  // General
  static const ok = 'OK';
  static const cancel = 'Cancel';
  static const exit = 'Exit';
  static const exitMessage = 'Are you sure you want to exit the application?';
  static const loadingText = 'Please wait...';
  static const login = 'Login';
  static const createAccount = 'Create Account';
  static const logout = 'Logout';
  static const forgotPassword = 'Forgot Password?';
  static const reset = 'Reset';
  static const newToApp = 'New to $appName?';
  static const signUp = 'Sign up';
  static const haveAnAccount = 'Have an account?';
  static const signIn = 'Sign in';
  static const submit = 'Submit';
  static const success = 'Success';
  static const next = 'Next';
  static const previous = 'Previous';
  static const personalInfo = 'Personal Info';
  static const contactInfo = 'Contact Info';
  static const status = 'Status';
  static const diagnostics = 'Diagnostics';

  static String required(String hint) {
    return '$hint is required.';
  }
}