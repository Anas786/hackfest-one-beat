import 'package:flutter/material.dart';
import 'package:flutter_gif/flutter_gif.dart';
import 'package:provider/provider.dart';

import '../../../data/managers/notification_manager.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/image_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../resources/app_assets.dart';
import '../../view_models/auth/auth_view_model.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({Key? key}) : super(key: key);

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with TickerProviderStateMixin {
  final int millis = 2500;
  FlutterGifController? controller;
  AuthViewModel? _authVM;

  @override
  void initState() {
    super.initState();
    _init();
    controller = FlutterGifController(vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      controller?.repeat(
        min: 0,
        max: 56,
        period: Duration(milliseconds: millis),
      );
      _authVM = Provider.of<AuthViewModel>(context, listen: false);
      _navigateNext();
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: controller == null
            ? ImageUtils.getLocalImage(AppAssets.imgLogo)
            : GifImage(
                controller: controller!,
                image: const AssetImage(AppAssets.imgSplash),
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

  Future<void> _navigateNext() async {
    final user = await _authVM?.getAuthUser();
    Future.delayed(Duration(milliseconds: millis)).then((value) {
      NavigationUtils.replace(
        context,
        user != null ? RouteConstants.home : RouteConstants.auth,
      );
    });
  }
}
