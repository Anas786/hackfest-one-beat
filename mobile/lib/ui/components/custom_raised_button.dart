import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomRaisedButton extends StatelessWidget {
  final String text;
  final Color? color;
  final double? width;
  final Color? textColor;
  final VoidCallback? onPressed;

  const CustomRaisedButton(
    this.text, {
    Key? key,
    this.width,
    this.color,
    this.textColor,
    this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? MediaQuery.of(context).size.width,
      child: RaisedButton(
        onPressed: onPressed,
        elevation: 0,
        color: color,
        textColor: textColor,
        child: Text(
          text,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.32,
          ),
        ),
      ),
    );
  }
}
