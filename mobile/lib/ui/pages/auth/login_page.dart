import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:provider/provider.dart';

import '../../../data/enums/ui_state.dart';
import '../../../data/models/network/requests/auth_request.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/image_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../components/custom_raised_button.dart';
import '../../components/custom_text_field.dart';
import '../../dialogs/progress_dialog.dart';
import '../../resources/app_assets.dart';
import '../../resources/app_strings.dart';
import '../../resources/app_styles.dart';
import '../../resources/app_theme.dart';
import '../../view_models/auth/auth_view_model.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormBuilderState>();
  final _uiState = ValueNotifier(UiState.none);
  final _obsecurePassword = ValueNotifier(true);
  final _request = AuthRequest();
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
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              _buildContent(),
              _buildSignUpWidget(),
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
                _buildLogo(),
                Insets.gapH25,
                _buildEmail(),
                Insets.gapH15,
                _buildPassword(),
                Insets.gapH25,
                CustomRaisedButton(
                  AppStrings.login,
                  onPressed: _submit,
                ),
                Insets.gapH20,
                _buildForgotPassword(),
                Insets.gapH40,
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return ImageUtils.getLocalImage(
      AppAssets.imgLogo,
      width: 300,
      height: 200,
    );
  }

  Widget _buildEmail() {
    return ValueListenableBuilder(
      valueListenable: _uiState,
      builder: (context, value, child) {
        return CustomTextField(
          labelText: AppStrings.email,
          hint: AppStrings.emailHint,
          prefixIcon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          validator: FormBuilderValidators.compose([
            FormBuilderValidators.required(
              errorText: AppStrings.required(AppStrings.email),
            ),
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
              prefixIcon: Icons.lock_outline,
              suffixIcon: value
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              onSuffixIconPressed: () {
                _obsecurePassword.value = !value;
              },
              textInputAction: TextInputAction.done,
              validator: FormBuilderValidators.required(
                errorText: AppStrings.required(AppStrings.password),
              ),
              onSaved: (newValue) {
                _request.password = newValue?.trim();
              },
            );
          },
        );
      },
    );
  }

  Widget _buildForgotPassword() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          AppStrings.forgotPassword,
          style: Texts.paragraph1.copyWith(color: AppTheme.descriptionColor),
        ),
        Insets.gapW4,
        InkWell(
          onTap: () {},
          child: Text(
            AppStrings.reset,
            style: Texts.paragraph1.copyWith(
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSignUpWidget() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            AppStrings.newToApp,
            style: Texts.paragraph1.copyWith(color: AppTheme.descriptionColor),
          ),
          Insets.gapW4,
          InkWell(
            onTap: () {},
            child: Text(
              AppStrings.signUp,
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

  void _submit() async {
    bool isValid = _formKey.currentState?.validate() ?? false;
    if (isValid) {
      CommonUtils.removeCurrentFocus(context);
      _formKey.currentState?.save();

      final result = await _authVM?.login(_request);
      if (!mounted) {
        return;
      }
      if (result?.isSuccess ?? false) {
        NavigationUtils.replace(context, RouteConstants.home);
      } else {
        DialogUtils.showErrorDialog(context, message: result?.message);
      }
    }
  }
}
