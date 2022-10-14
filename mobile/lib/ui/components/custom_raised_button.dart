import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../resources/app_styles.dart';

class CustomRaisedButton extends StatelessWidget {
  final String text;
  final Color? color;
  final double? width;
  final double? height;
  final Color? textColor;
  final VoidCallback? onPressed;

  const CustomRaisedButton(
    this.text, {
    Key? key,
    this.width,
    this.height,
    this.color,
    this.textColor,
    this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: RaisedButton(
        onPressed: onPressed,
        elevation: 0,
        color: color,
        textColor: textColor,
        child: Text(
          text,
          style: Texts.button,
        ),
      ),
    );
  }
}
