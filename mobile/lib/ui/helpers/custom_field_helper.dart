import 'package:flutter/material.dart';

import '../../util/utilities/image_utils.dart';
import '../resources/app_styles.dart';
import '../resources/app_theme.dart';

enum FieldState { unfocused, error, success }

class CustomFieldHelper {
  const CustomFieldHelper._internal();

  static Widget labelText(BuildContext context, String? labelText) {
    return Visibility(
      visible: labelText?.isNotEmpty == true,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        width: MediaQuery.of(context).size.width,
        child: Text(
          labelText ?? '',
          style: hintStyle(Colors.black),
        ),
      ),
    );
  }

  static TextStyle hintStyle([Color? color]) {
    return Texts.hint.copyWith(color: color);
  }

  static TextStyle helperStyle() {
    return hintStyle(AppTheme.grayColor).copyWith(fontSize: 12);
  }

  static TextStyle errorStyle() {
    return hintStyle(AppTheme.errorColor).copyWith(fontSize: 12);
  }

  static TextStyle textStyle([Color? color]) {
    return Texts.paragraph1.copyWith(color: color);
  }

  static InputDecoration inputDecorator(
    BuildContext context, {
    GlobalKey<FormFieldState>? fieldKey,
    bool enabled = true,
    String? hint,
    Widget? prefix,
    Widget? suffix,
  }) {
    return InputDecoration(
      counter: const SizedBox.shrink(),
      floatingLabelBehavior: FloatingLabelBehavior.never,
      enabled: enabled,
      prefixIcon: prefix,
      suffixIcon: suffix,
      hintText: hint,
      hintStyle: hintStyle(AppTheme.grayColor),
      helperStyle: helperStyle(),
      helperMaxLines: 2,
      errorStyle: errorStyle(),
      errorMaxLines: 2,
      enabledBorder: inputBorder(stateColor(fieldKey)),
      focusedBorder: inputBorder(Theme.of(context).colorScheme.primary),
      disabledBorder: inputBorder(Theme.of(context).disabledColor),
      errorBorder: inputBorder(Theme.of(context).colorScheme.error),
      focusedErrorBorder: inputBorder(Theme.of(context).colorScheme.error),
    );
  }

  static OutlineInputBorder inputBorder(
    Color color) {
    return OutlineInputBorder(
      borderRadius: Corners.rounded8,
      borderSide: BorderSide(
        color: color,
        width: 1,
      ),
    );
  }

  static Widget? prefixIcon(dynamic icon, [Color? color]) {
    if (icon == null) {
      return null;
    }
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0.0),
      child: iconChild(icon, color),
    );
  }

  static Widget? iconChild(dynamic icon, [Color? color]) {
    if (icon is IconData) {
      return Icon(icon, color: color);
    } else if (icon is String) {
      return ImageUtils.getLocalSvgImage(icon, color: color);
    }
    return null;
  }

  static Color stateColor(GlobalKey<FormFieldState>? fieldKey) {
    final state = fieldState(fieldKey);
    if (state == FieldState.error) {
      return AppTheme.errorColor;
    } else if (state == FieldState.success) {
      return AppTheme.successColor;
    } else {
      return AppTheme.grayColor;
    }
  }

  static FieldState fieldState(GlobalKey<FormFieldState>? fieldKey) {
    if (hasError(fieldKey)) {
      return FieldState.error;
    } else if (isSuccess(fieldKey)) {
      return FieldState.success;
    } else {
      return FieldState.unfocused;
    }
  }

  static bool hasError(GlobalKey<FormFieldState>? fieldKey) {
    return fieldKey?.currentState?.hasError == true;
  }

  static bool isSuccess(GlobalKey<FormFieldState>? fieldKey) {
    final fieldValue = fieldKey?.currentState?.value as String?;
    return fieldValue?.isNotEmpty == true && !hasError(fieldKey);
  }
}
