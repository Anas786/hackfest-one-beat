import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nested/nested.dart';
import 'package:provider/provider.dart';

import 'di/injector.dart';
import 'ui/resources/app_strings.dart';
import 'ui/resources/app_theme.dart';
import 'ui/view_models/auth/auth_view_model.dart';
import 'ui/view_models/home/home_view_model.dart';
import 'ui/view_models/patient/patient_view_model.dart';
import 'util/constants/route_constants.dart';
import 'util/utilities/log_utils.dart';
import 'util/utilities/route_utils.dart';

void main() {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await _initialize();

    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.manual,
      overlays: [SystemUiOverlay.bottom, SystemUiOverlay.top],
    );
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;

    runApp(const Application());
  }, (error, trace) {
    FirebaseCrashlytics.instance.recordError(error, trace);
  });
}

Future<void> _initialize() async {
  await Firebase.initializeApp();
  setupDI();
  LogUtils.init();
}

class Application extends StatelessWidget {
  const Application({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: _getProviders(),
      child: MaterialApp(
        title: AppStrings.appName,
        theme: AppTheme.appTheme,
        debugShowCheckedModeBanner: false,
        initialRoute: RouteConstants.index,
        onGenerateRoute: RouteUtils.generateRoute,
      ),
    );
  }

  List<SingleChildWidget> _getProviders() {
    return [
      ChangeNotifierProvider(create: (ctx) => AuthViewModel()),
      ChangeNotifierProvider(create: (ctx) => PatientViewModel()),
      ChangeNotifierProvider(create: (ctx) => HomeViewModel()),
    ];
  }
}
