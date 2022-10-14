import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';

import '../../../data/managers/notification_manager.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../view_models/auth/auth_view_model.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({Key? key}) : super(key: key);

  @override
  _SplashPageState createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  AuthViewModel? _authVM;

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _authVM = Provider.of<AuthViewModel>(context, listen: false);
      _loadUser();
    });
    _init();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.primary,
      body: const Center(
        child: SpinKitRing(
          size: 48,
          lineWidth: 4.0,
          color: Colors.white,
        ),
      ),
    );
  }

  Future<void> _init() async {
    if (!mounted) {
      return;
    }
    await NotificationManager().init(context);
  }

  Future<void> _loadUser() async {
    final user = await _authVM?.getAuthUser();
    Future.delayed(const Duration(seconds: 2)).then((value) {
      NavigationUtils.replace(
        context,
        user != null ? RouteConstants.home : RouteConstants.auth,
      );
    });
  }
}
