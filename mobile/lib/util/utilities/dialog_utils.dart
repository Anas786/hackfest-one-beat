import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../ui/resources/app_strings.dart';
import 'navigation_utils.dart';
import 'widget_utils.dart';

class DialogUtils {
  const DialogUtils._internal();

  // Create and show dialog instantly
  static Future<T?> showAlertDialog<T>(
    BuildContext context, {
    String? title,
    String? message,
    bool? dismissible = true,
    String? secondaryButtonText,
    VoidCallback? secondaryButtonCallback,
    String primaryButtonText = AppStrings.ok,
    VoidCallback? primaryButtonCallback,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: dismissible ?? true,
      builder: (dialogContext) {
        return WillPopScope(
          onWillPop: () async {
            return dismissible ?? true;
          },
          child: getAlertDialog(
            dialogContext,
            title: title,
            message: message,
            secondaryButtonText: secondaryButtonText,
            secondaryButtonCallback: secondaryButtonCallback,
            primaryButtonText: primaryButtonText,
            primaryButtonCallback: primaryButtonCallback,
          ),
        );
      },
    );
  }

  static Future<T?> showCustomDialog<T>(
    BuildContext context, {
    required Widget content,
    bool? dismissible = true,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: dismissible ?? true,
      builder: (dialogContext) {
        return AlertDialog(
          scrollable: true,
          insetPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 24,
          ),
          content: content,
        );
      },
    );
  }

  // Create a dialog widget
  static Widget getAlertDialog(
    BuildContext context, {
    String? title,
    String? message,
    String? secondaryButtonText,
    VoidCallback? secondaryButtonCallback,
    String primaryButtonText = AppStrings.ok,
    VoidCallback? primaryButtonCallback,
  }) {
    return AlertDialog(
      scrollable: true,
      insetPadding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 24,
      ),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(8)),
      ),
      title: _buildTitle(title),
      content: _buildMessage(message),
      actions: [
        _buildSecondaryButton(
          context,
          secondaryButtonText,
          secondaryButtonCallback,
        ),
        _buildPrimaryButton(
          context,
          primaryButtonText,
          primaryButtonCallback,
        ),
      ],
    );
  }

  static void showErrorDialog(
    BuildContext context, {
    String? title,
    String? message,
  }) {
    showAlertDialog(
      context,
      title: title ?? AppStrings.error,
      message: message ?? AppStrings.errorGeneral,
    );
  }

  static Widget? _buildTitle(String? title) {
    if (title != null) {
      return Text(
        title,
        style: GoogleFonts.lato(
          fontWeight: FontWeight.w600,
        ),
      );
    }
    return null;
  }

  static Widget? _buildMessage(String? message) {
    if (message != null) {
      return SingleChildScrollView(
        child: Text(
          message,
          style: GoogleFonts.lato(),
        ),
      );
    }
    return null;
  }

  static Widget _buildSecondaryButton(
    BuildContext context,
    String? text,
    VoidCallback? callback,
  ) {
    if (text != null) {
      return WidgetUtils.getFlatButton(
        text,
        color: Theme.of(context).colorScheme.secondary,
        onPressed: () {
          NavigationUtils.pop(context, result: false);
          if (callback != null) {
            callback();
          }
        },
      );
    }
    return Container();
  }

  static Widget _buildPrimaryButton(
    BuildContext context,
    String text,
    VoidCallback? callback,
  ) {
    return WidgetUtils.getFlatButton(
      text,
      color: Theme.of(context).colorScheme.primary,
      onPressed: () {
        NavigationUtils.pop(context, result: true);
        if (callback != null) {
          callback();
        }
      },
    );
  }
}
