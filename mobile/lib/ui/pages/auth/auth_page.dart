import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:onebeat/util/utilities/common_utils.dart';
import 'package:provider/provider.dart';

import '../../../data/models/network/requests/auth_request.dart';
import '../../../data/models/ui/page_arguments.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../../util/utilities/widget_utils.dart';
import '../../dialogs/progress_dialog.dart';
import '../../resources/app_strings.dart';
import '../../view_models/auth/auth_view_model.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({Key? key}) : super(key: key);

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  AuthViewModel? _authVM;

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _authVM = Provider.of<AuthViewModel>(context, listen: false);
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return await _onBackPressed();
      },
      child: Scaffold(
        appBar: _buildAppBar(),
        body: _buildBody(),
      ),
    );
  }

  Future<bool> _onBackPressed() async {
    return await CommonUtils.onBackPressed(
      context,
      _authVM?.isLoading,
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      title: const Text(AppStrings.appName),
    );
  }

  Widget _buildBody() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    child: Text(
                      '${_getAuthRequest().toJson()}',
                      style: GoogleFonts.lato(
                        fontSize: 24,
                        color: Colors.black54,
                      ),
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(24),
                  width: constraints.maxWidth,
                  child: WidgetUtils.getRaisedButton(
                    AppStrings.login.toUpperCase(),
                    onPressed: _loginUser,
                  ),
                ),
              ],
            ),
            Consumer<AuthViewModel>(
              builder: (context, value, child) {
                return ProgressDialog(visible: value.isLoading);
              },
            ),
          ],
        );
      },
    );
  }

  void _loginUser() async {
    final request = _getAuthRequest();
    final result = await _authVM?.login(request);
    if (!mounted) {
      return;
    }
    if (result?.isSuccess ?? false) {
      NavigationUtils.replace(
        context,
        RouteConstants.home,
        args: PageArguments(data: result!.data),
      );
    } else {
      DialogUtils.showErrorDialog(
        context,
        message: result?.message,
      );
    }
  }

  AuthRequest _getAuthRequest() {
    return AuthRequest(
      email: 'mohsin@yopmail.com',
      password: '12345678',
    );
  }
}
