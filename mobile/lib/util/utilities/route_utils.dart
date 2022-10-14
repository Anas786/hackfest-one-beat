import 'package:flutter/material.dart';

import '../../data/models/entities/user.dart';
import '../../data/models/ui/page_arguments.dart';
import '../../ui/pages/auth/auth_page.dart';
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
      // Initial route doesn't requires transition
      return MaterialPageRoute(
        builder: (ctx) => const SplashPage(),
      );
    } else if (route == RouteConstants.auth) {
      return _getPageRoute(
        const AuthPage(),
      );
    } else if (route == RouteConstants.home) {
      final user = args?.data as User?;
      return _getPageRoute(
        const HomePage(),
      );
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
