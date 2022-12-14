import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_styles.dart';

class AppTheme {
  const AppTheme._internal();

  // {
  //     FontWeight.w100: 'Thin',
  //     FontWeight.w200: 'ExtraLight',
  //     FontWeight.w300: 'Light',
  //     FontWeight.w400: 'Regular',
  //     FontWeight.w500: 'Medium',
  //     FontWeight.w600: 'SemiBold',
  //     FontWeight.w700: 'Bold',
  //     FontWeight.w800: 'ExtraBold',
  //     FontWeight.w900: 'Black',
  // }

  static const Color primaryColor = Color(0xFF853BEF);
  // static const Color secondaryColor = Color(0xFFf35b9c);
  static const Color dividerColor = Color(0xFFE6E8E7);
  static const Color successColor = Color(0xFF049f55);
  static const Color errorColor = Color(0xFFe63950);
  static const Color darkGrayColor = Color(0xFF969aa8);
  static const Color grayColor = Color(0xFFadadad);
  static const Color selectedDateColor = Color(0xFF11AD34);
  static const Color bookedDateColor = Color(0xFFC80000);
  static const Color vacantDateColor = Color(0xFFECF3FD);
  static const Color disabledDateTextColor = Color(0x80555555);
  static const Color calendarDowHeaderColor = Color(0x80E6E8E7);
  static const Color primaryTextColor = Colors.black;
  static const Color backgroundColor = Colors.white;

  static final ThemeData appTheme = ThemeData(
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: primaryColor,
      secondary: primaryColor,
      error: errorColor,
    ),
    dividerColor: dividerColor,
    appBarTheme: const AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.light,
    ),
    buttonTheme: const ButtonThemeData(
      textTheme: ButtonTextTheme.primary,
      height: 54,
      shape: RoundedRectangleBorder(
        borderRadius: Corners.rounded8,
      ),
      buttonColor: primaryColor,
    ),
    textTheme: GoogleFonts.poppinsTextTheme(),
    iconTheme: const IconThemeData(color: primaryColor),
    snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
    disabledColor: grayColor,
    backgroundColor: backgroundColor,
    scaffoldBackgroundColor: backgroundColor,
    drawerTheme: const DrawerThemeData(backgroundColor: backgroundColor),
  );
}
