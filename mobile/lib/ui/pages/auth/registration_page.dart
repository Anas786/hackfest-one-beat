import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:provider/provider.dart';

import '../../../data/enums/ui_state.dart';
import '../../../data/models/network/requests/auth_request.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../../util/utilities/widget_utils.dart';
import '../../components/custom_raised_button.dart';
import '../../components/custom_text_field.dart';
import '../../dialogs/progress_dialog.dart';
import '../../resources/app_strings.dart';
import '../../resources/app_styles.dart';
import '../../resources/app_theme.dart';
import '../../view_models/auth/auth_view_model.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({Key? key}) : super(key: key);

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormBuilderState>();
  final _uiState = ValueNotifier(UiState.none);
  final _obsecurePassword = ValueNotifier(true);
  final _request = RegisterRequest();
  int _currentStep = 0;
  AuthViewModel? _authVM;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _authVM = Provider.of<AuthViewModel>(context, listen: false);
    });
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
          padding: const EdgeInsets.symmetric(horizontal: 0),
          child: Column(
            children: [
              _buildContent(),
              _buildLoginWidget(),
            ],
          ),
        ),
        Consumer<AuthViewModel>(
          builder: (context, value, child) {
            return ProgressDialog(visible: value.isLoading);
          },
        ),
      ],
    );
  }

  Widget _buildContent() {
    return Expanded(
      child: ScrollConfiguration(
        behavior: const ScrollBehavior().copyWith(overscroll: false),
        child: SingleChildScrollView(
          child: FormBuilder(
            key: _formKey,
            child: Column(
              children: [
                WidgetUtils.getAppLogo(),
                _buildStepper(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStepper() {
    return Stepper(
      physics: const ScrollPhysics(),
      currentStep: _currentStep,
      onStepTapped: onTapped,
      onStepContinue: onContinued,
      onStepCancel: onCancel,
      steps: [
        _personalInfoStep(),
        _contactInfoStep(),
        _statusStep(),
        _diagnosticsStep(),
      ],
      controlsBuilder: (context, details) {
        if (details.currentStep <= 0) {
          return Row(
            children: [
              CustomRaisedButton(
                AppStrings.next,
                onPressed: details.onStepContinue,
              ),
            ],
          );
        } else if (details.currentStep >= 3) {
          return Row(
            children: [
              CustomRaisedButton(
                AppStrings.submit,
                onPressed: _submit,
              ),
            ],
          );
        } else {
          return Row(
            children: [
              CustomRaisedButton(
                AppStrings.next,
                onPressed: details.onStepContinue,
              ),
              Insets.gapW8,
              TextButton(
                onPressed: details.onStepCancel,
                child: Text(
                  AppStrings.previous,
                  style: Texts.button.copyWith(color: AppTheme.darkGrayColor),
                ),
              ),
            ],
          );
        }
      },
    );
  }

  Step _personalInfoStep() {
    return Step(
      title: Text(
        AppStrings.personalInfo,
        style: Texts.heading3,
      ),
      isActive: _currentStep >= 0,
      state: _currentStep >= 0 ? StepState.complete : StepState.disabled,
      content: Container(),
    );
  }

  Step _contactInfoStep() {
    return Step(
      title: Text(
        AppStrings.contactInfo,
        style: Texts.heading3,
      ),
      isActive: _currentStep >= 0,
      state: _currentStep >= 1 ? StepState.complete : StepState.disabled,
      content: Container(),
    );
  }

  Step _statusStep() {
    return Step(
      title: Text(
        AppStrings.status,
        style: Texts.heading3,
      ),
      isActive: _currentStep >= 0,
      state: _currentStep >= 2 ? StepState.complete : StepState.disabled,
      content: Container(),
    );
  }

  Step _diagnosticsStep() {
    return Step(
      title: Text(
        AppStrings.diagnostics,
        style: Texts.heading3,
      ),
      isActive: _currentStep >= 0,
      state: _currentStep >= 3 ? StepState.complete : StepState.disabled,
      content: Container(),
    );
  }

  Widget _buildLoginWidget() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
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
      _authVM?.isLoading,
    );
  }

  onTapped(int step) {
    setState(() => _currentStep = step);
  }

  onContinued() {
    _currentStep < 3 ? setState(() => _currentStep += 1) : null;
  }

  onCancel() {
    _currentStep > 0 ? setState(() => _currentStep -= 1) : null;
  }

  void _submit() async {
    bool isValid = _formKey.currentState?.validate() ?? false;
    if (isValid) {
      CommonUtils.removeCurrentFocus(context);
      _formKey.currentState?.save();

      // final result = await _authVM?.register(_request);
      // if (!mounted) {
      //   return;
      // }
      // if (result?.isSuccess ?? false) {
      //   _onBackPressed();
      // } else {
      //   DialogUtils.showErrorDialog(context, message: result?.message);
      // }
    }
  }
}
