import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_theme.dart';

/// A class that holds all the gaps and insets used
/// throughout the entire app by things such as padding, sizedbox etc.
@immutable
class Insets {
  const Insets._internal();

  /// [SizedBox] of height **4**.
  static const gapH4 = SizedBox(height: 4);

  /// [SizedBox] of width **4**.
  static const gapW4 = SizedBox(width: 4);

  /// [SizedBox] of height **10**.
  static const gapH10 = SizedBox(height: 10);

  /// [SizedBox] of width **10**
  static const gapW10 = SizedBox(width: 10);

  /// [SizedBox] of width **15**
  static const gapW15 = SizedBox(width: 15);

  /// [SizedBox] of height **15**
  static const gapH15 = SizedBox(height: 15);

  /// [SizedBox] of height **20**
  static const gapH20 = SizedBox(height: 20);

  /// [SizedBox] of height **25**
  static const gapH25 = SizedBox(height: 25);

  /// [SizedBox] of height **40**
  static const gapH40 = SizedBox(height: 40);

  /// [Spacer] for adding infinite gaps, as much as the constraints
  /// allow.
  static const expand = Spacer();
}

/// A class that holds all the border radius used throughout
/// the entire app by things such as container, card etc.
///
@immutable
class Corners {
  const Corners._internal();

  static const BorderRadius rounded4 = BorderRadius.all(Radius.circular(4));
  static const BorderRadius rounded16 = BorderRadius.all(Radius.circular(16));
}

/// A class that holds all the text specific styles used throughout
/// the entire app by things such as heading, description, input field, etc
///
/// This class has no constructor and all variables are `static`.
@immutable
class Texts {
  const Texts._internal();

  static final TextStyle heading1 = GoogleFonts.raleway(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.48,
    color: AppTheme.primaryTextColor,
  );

  static final TextStyle heading2 = GoogleFonts.poppins(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppTheme.primaryTextColor,
  );

  static final TextStyle paragraph1 = GoogleFonts.poppins(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.28,
  );

  static final TextStyle hint = GoogleFonts.poppins(
    fontSize: 14,
    fontWeight: FontWeight.w500,
  );

  static final TextStyle title1 = GoogleFonts.poppins(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.black,
  );
}