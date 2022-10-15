import 'package:flutter/material.dart';

import '../../data/models/ui/page_arguments.dart';
import '../../ui/pages/auth/login_page.dart';
import '../../ui/pages/auth/registration_page.dart';
import '../../ui/pages/book_appointment/choose_facility_page.dart';
import '../../ui/pages/home/home_page.dart';
import '../../ui/pages/splash/splash_page.dart';
import '../constants/route_constants.dart';
import 'log_utils.dart';

class RouteUtils {
  const RouteUtils._internal();

  static Route<dynamic>? generateRoute(RouteSettings settings) {
    // Route arguments can be managed here and values for those can be passed to page constructor.
    // If we do not want to pass arguments directly to page constructor and let the particular page
    // handle the arguments itself than we must pass 'settings' as an argument to MaterialPageRoute

    final route = settings.name;
    final args = settings.arguments as PageArguments?;
    LogUtils.debug('Route[name=$route, Args=${args?.toJson()}]');

    if (route == RouteConstants.index) {
      return _getPageRoute(const SplashPage());
    } else if (route == RouteConstants.login) {
      return _getPageRoute(const LoginPage());
    } else if (route == RouteConstants.register) {
      return _getPageRoute(const RegistrationPage());
    } else if (route == RouteConstants.home) {
      return _getPageRoute(const HomePage());
    } else if (route == RouteConstants.chooseFacility) {
      return _getPageRoute(const ChooseFacilityPage());
    }
    return null;
  }

  static MaterialPageRoute _getPageRoute(
    Widget page, {
    RouteSettings? settings,
  }) {
    return MaterialPageRoute(
      builder: (ctx) => page,
      settings: settings,
    );
  }
}
