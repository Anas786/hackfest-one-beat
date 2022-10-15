import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:provider/provider.dart';

import '../../../data/enums/ui_state.dart';
import '../../../data/models/network/requests/patient_request.dart';
import '../../../util/constants/app_constants.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/datetime_utils.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../../util/utilities/widget_utils.dart';
import '../../components/custom_dropdown.dart';
import '../../components/custom_raised_button.dart';
import '../../components/custom_text_field.dart';
import '../../dialogs/progress_dialog.dart';
import '../../helpers/custom_field_helper.dart';
import '../../resources/app_strings.dart';
import '../../resources/app_styles.dart';
import '../../resources/app_theme.dart';
import '../../view_models/patient/patient_view_model.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({Key? key}) : super(key: key);

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormBuilderState>();
  final _uiState = ValueNotifier(UiState.none);
  final _obsecurePassword = ValueNotifier(true);
  final _dobController = TextEditingController();
  final _request = PatientRequest();
  final _cnicMask = MaskTextInputFormatter(
    mask: AppStrings.cnicMask,
    filter: {"#": RegExp(r'[0-9]')},
  );
  final _phoneMask = MaskTextInputFormatter(
    mask: AppStrings.mobileMask,
    filter: {"#": RegExp(r'[0-9]')},
  );
  PatientViewModel? _viewModel;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _viewModel = Provider.of<PatientViewModel>(context, listen: false);
    });
  }

  @override
  void dispose() {
    _dobController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return await _onBackPressed();
      },
      child: SafeArea(
        child: Scaffold(
          body: _buildBody(),
        ),
      ),
    );
  }

  Widget _buildBody() {
    return Stack(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: _buildContent(),
        ),
        Consumer<PatientViewModel>(
          builder: (context, value, child) {
            return ProgressDialog(visible: value.isLoading);
          },
        ),
      ],
    );
  }

  Widget _buildContent() {
    return ScrollConfiguration(
      behavior: const ScrollBehavior().copyWith(overscroll: false),
      child: SingleChildScrollView(
        child: FormBuilder(
          key: _formKey,
          child: Column(
            children: [
              WidgetUtils.getAppLogo(),
              _buildUsername(),
              Insets.gapH16,
              CustomFieldHelper.labelText(context, AppStrings.name),
              Row(
                children: [
                  Flexible(child: _buildFirstName()),
                  Insets.gapW16,
                  Flexible(child: _buildLastName()),
                ],
              ),
              Insets.gapH16,
              _buildEmail(),
              Insets.gapH16,
              _buildPassword(),
              Insets.gapH16,
              _buildCNIC(),
              Insets.gapH16,
              _buildPhone(),
              Insets.gapH16,
              _buildDateOfBirth(),
              Insets.gapH16,
              _buildGender(),
              Insets.gapH24,
              CustomRaisedButton(
                AppStrings.createAccount,
                width: MediaQuery.of(context).size.width,
                onPressed: _submit,
              ),
              _buildLoginWidget(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUsername() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: AppStrings.username,
          hint: AppStrings.usernameHint,
          keyboardType: TextInputType.text,
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.required(
            errorText: AppStrings.required(AppStrings.username),
          ),
          onSaved: (newValue) {
            _request.username = newValue?.trim();
          },
        );
      },
    );
  }

  Widget _buildFirstName() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: null,
          hint: AppStrings.firstNameHint,
          keyboardType: TextInputType.name,
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.required(
            errorText: AppStrings.required(AppStrings.firstName),
          ),
          onSaved: (newValue) {
            _request.firstName = newValue?.trim();
          },
        );
      },
    );
  }

  Widget _buildLastName() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: null,
          hint: AppStrings.lastNameHint,
          keyboardType: TextInputType.name,
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.required(
            errorText: AppStrings.required(AppStrings.lastName),
          ),
          onSaved: (newValue) {
            _request.lastName = newValue?.trim();
          },
        );
      },
    );
  }

  Widget _buildEmail() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: AppStrings.emailOptional,
          hint: AppStrings.emailHint,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.email(errorText: AppStrings.invalidEmail),
          ]),
          onSaved: (newValue) {
            _request.email = newValue?.trim();
          },
        );
      },
    );
  }

  Widget _buildPassword() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return ValueListenableBuilder<bool>(
          valueListenable: _obsecurePassword,
          builder: (context, value, child) {
            return CustomTextField(
              labelText: AppStrings.password,
              hint: AppStrings.passwordHint,
              obscureText: value,
              suffixIcon: value
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              onSuffixIconPressed: () {
                _obsecurePassword.value = !value;
              },
              textInputAction: TextInputAction.done,
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(
                  errorText: AppStrings.required(AppStrings.password),
                ),
                FormBuilderValidators.minLength(
                  8,
                  errorText: AppStrings.invalidPassword,
                )
              ]),
              onSaved: (newValue) {
                _request.password = newValue?.trim();
              },
            );
          },
        );
      },
    );
  }

  Widget _buildCNIC() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: AppStrings.cnic,
          hint: AppStrings.cnicMask,
          keyboardType: TextInputType.number,
          inputFormatters: [_cnicMask],
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(
              errorText: AppStrings.required(AppStrings.cnic),
            ),
            FormBuilderValidators.minLength(
              15, // 13 + 2 for mask
              errorText: AppStrings.invalidCNIC,
            ),
          ]),
          onSaved: (newValue) {
            _request.identityNumber = _cnicMask.getUnmaskedText();
          },
        );
      },
    );
  }

  Widget _buildPhone() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: AppStrings.mobile,
          hint: AppStrings.mobileMask,
          keyboardType: TextInputType.number,
          inputFormatters: [_phoneMask],
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(
              errorText: AppStrings.required(AppStrings.mobile),
            ),
            FormBuilderValidators.minLength(
              12, // 11 + 1 for mask
              errorText: AppStrings.invalidMobileNumber,
            ),
          ]),
          onSaved: (newValue) {
            _request.phone = _phoneMask.getUnmaskedText();
          },
        );
      },
    );
  }

  Widget _buildDateOfBirth() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          readOnly: true,
          labelText: AppStrings.dob,
          hint: AppStrings.select,
          controller: _dobController,
          suffixIcon: Icons.keyboard_arrow_down_outlined,
          onFieldTap: () {
            CommonUtils.removeCurrentFocus(context);
            CommonUtils.openDatePicker(
              context,
              onDateSelected: (date) {
                final formattedDate = DateTimeUtils.format(
                  AppConstants.dateRequestFormat,
                  date,
                );
                if (formattedDate != null) {
                  _dobController.text = formattedDate;
                }
              },
            );
          },
          validator: FormBuilderValidators.required(
            errorText: AppStrings.required(AppStrings.dob),
          ),
          onSaved: (newValue) {
            _request.dateOfBirth = newValue?.trim();
          },
        );
      },
    );
  }

  Widget _buildGender() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomDropdown(
          labelText: AppStrings.gender,
          hint: AppStrings.select,
          options: const ['Male', 'Female'],
          suffixIcon: Icons.keyboard_arrow_down_outlined,
          validator: FormBuilderValidators.required(
            errorText: AppStrings.required(AppStrings.gender),
          ),
          onSaved: (newValue) {
            _request.gender = newValue?.trim().substring(0, 1);
          },
        );
      },
    );
  }

  Widget _buildLoginWidget() {
    return Padding(
      padding: const EdgeInsets.only(top: 20, bottom: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            AppStrings.haveAnAccount,
            style: Texts.paragraph1.copyWith(color: AppTheme.darkGrayColor),
          ),
          Insets.gapW4,
          InkWell(
            onTap: _onBackPressed,
            child: Text(
              AppStrings.signIn,
              style: Texts.paragraph1.copyWith(
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<bool> _onBackPressed() async {
    return await CommonUtils.onBackPressed(
      context,
      _viewModel?.isLoading,
    );
  }

  void _submit() async {
    bool isValid = _formKey.currentState?.validate() ?? false;
    if (isValid) {
      CommonUtils.removeCurrentFocus(context);
      _formKey.currentState?.save();

      final result = await _viewModel?.create(_request);
      if (!mounted) {
        return;
      }
      if (result?.isSuccess ?? false) {
        DialogUtils.showInfoDialog(
          context,
          message: result?.message,
          callback: () {
            NavigationUtils.clearStack(
              context,
              newRouteName: RouteConstants.login,
            );
          },
        );
      } else {
        DialogUtils.showErrorDialog(context, message: result?.message);
      }
    }
  }
}
