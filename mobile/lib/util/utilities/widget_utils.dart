import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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
        style: GoogleFonts.lato(),
      ),
    );
  }

  static Widget getRaisedButton(
    String text, {
    Color? color,
    Color? textColor,
    VoidCallback? onPressed,
  }) {
    return RaisedButton(
      onPressed: onPressed,
      color: color,
      textColor: textColor,
      child: Text(
        text,
        style: GoogleFonts.lato(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
