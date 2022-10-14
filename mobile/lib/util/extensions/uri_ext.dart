import 'package:url_launcher/url_launcher.dart';

import '../utilities/log_utils.dart';

extension UriExtension on Uri {
  Future<void> launchInBrowser() async {
    final launched = await launchUrl(this, mode: LaunchMode.externalApplication);
    if (!launched) {
      LogUtils.error('Could not launch $this');
    }
  }

  Future<void> launchInWebView() async {
    final launched = await launchUrl(this, mode: LaunchMode.inAppWebView);
    if (!launched) {
      LogUtils.error('Could not launch $this');
      return;
    }
    await closeInAppWebView();
  }
}
