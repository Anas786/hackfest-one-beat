import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'image_utils.dart';
import '../../ui/resources/app_assets.dart';

class WidgetUtils {
  const WidgetUtils._internal();

  static Widget getFlatButton(
    String text, {
    Color? color,
    VoidCallback? onPressed,
  }) {
    return FlatButton(
      textColor: color,
      height: 36,
      minWidth: 88,
      onPressed: onPressed,
      child: Text(
        text.toUpperCase(),
        style: GoogleFonts.poppins(),
      ),
    );
  }

  static Widget getAppLogo() {
    return ImageUtils.getLocalImage(
      AppAssets.imgLogo,
      width: 300,
      height: 175,
    );
  }
}
