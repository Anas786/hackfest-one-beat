import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:flutter/material.dart';

import '../helpers/custom_field_helper.dart';
import '../helpers/debouncer.dart';
import '../resources/app_theme.dart';

class CustomDropdown extends StatefulWidget {
  final String? labelText;
  final List<String>? options;
  final AutovalidateMode autoValidateMode;
  final ValueChanged<String?>? onChanged;
  final FormFieldValidator<String>? validator;
  final FormFieldSetter<String>? onSaved;
  final dynamic prefixIcon;
  final dynamic suffixIcon;
  final String? selectedValue;
  final String? hint;
  final double borderRadius;

  const CustomDropdown({
    Key? key,
    required this.labelText,
    required this.options,
    this.autoValidateMode = AutovalidateMode.onUserInteraction,
    this.onChanged,
    this.validator,
    this.onSaved,
    this.prefixIcon,
    this.suffixIcon,
    this.selectedValue,
    this.hint,
    this.borderRadius = 15,
  }) : super(key: key);

  @override
  State<CustomDropdown> createState() => _CustomDropdownState();
}

class _CustomDropdownState<T> extends State<CustomDropdown> {
  final _fieldKey = GlobalKey<FormFieldState>();
  final _debouncer = Debouncer(milliseconds: 100);

  @override
  Widget build(BuildContext context) {
    final prefix = CustomFieldHelper.prefixIcon(
      widget.prefixIcon,
      CustomFieldHelper.stateColor(_fieldKey),
    );
    final suffix = _suffixIcon();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomFieldHelper.labelText(context, widget.labelText),
        DropdownButtonHideUnderline(
          child: DropdownButtonFormField2<String>(
            key: _fieldKey,
            value: widget.selectedValue,
            hint: Text(
              widget.hint ?? '',
              style: CustomFieldHelper.hintStyle(AppTheme.grayColor),
              overflow: TextOverflow.ellipsis,
            ),
            autovalidateMode: widget.autoValidateMode,
            isDense: false,
            isExpanded: true,
            icon: suffix,
            items: _dropdownItems(),
            focusColor: Colors.transparent,
            dropdownDecoration: const BoxDecoration(
              color: AppTheme.backgroundColor,
            ),
            decoration: CustomFieldHelper.inputDecorator(
              context,
              fieldKey: _fieldKey,
              prefix: prefix,
            ).copyWith(
              contentPadding: EdgeInsets.fromLTRB(
                prefix == null ? 16 : 0,
                2,
                suffix == null ? 16 : 16,
                2,
              ),
            ),
            onChanged: (value) {
              if (widget.onChanged != null) {
                widget.onChanged!(value);
              }
              _debouncer.run(() {
                setState(() {});
              });
            },
            validator: widget.validator,
            onSaved: widget.onSaved,
          ),
        ),
      ],
    );
  }

  List<DropdownMenuItem<String>> _dropdownItems() {
    return widget.options
            ?.map((v) => DropdownMenuItem(
                  value: v,
                  child: Text(
                    v,
                    style: CustomFieldHelper.textStyle(AppTheme.primaryTextColor),
                    overflow: TextOverflow.ellipsis,
                  ),
                ))
            .toList() ??
        [];
  }

  Widget? _suffixIcon() {
    return CustomFieldHelper.iconChild(
      widget.suffixIcon,
      CustomFieldHelper.stateColor(_fieldKey),
    );
  }
}
