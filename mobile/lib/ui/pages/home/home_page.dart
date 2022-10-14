import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../../util/utilities/widget_utils.dart';
import '../../resources/app_strings.dart';
import '../../view_models/auth/auth_view_model.dart';
import '../../dialogs/progress_dialog.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authVM = Provider.of<AuthViewModel>(context);

    return Scaffold(
      appBar: _buildAppBar(),
      body: _buildBody(authVM, context),
    );
  }

  AppBar _buildAppBar() => AppBar(title: const Text(AppStrings.titleHome));

  Widget _buildBody(AuthViewModel authVM, BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: Text(
                    'Welcome ${authVM.user?.name ?? ''}!',
                    style: GoogleFonts.lato(
                      fontSize: 24,
                      color: Colors.black54,
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(24),
                  width: constraints.maxWidth,
                  child: WidgetUtils.getRaisedButton(
                    AppStrings.logout.toUpperCase(),
                    onPressed: () => _logoutUser(authVM, context),
                    color: Theme.of(context).colorScheme.error,
                  ),
                ),
              ],
            ),
            ProgressDialog(visible: authVM.isLoading),
          ],
        );
      },
    );
  }

  void _logoutUser(
    AuthViewModel authVM,
    BuildContext context,
  ) async {
    authVM.logout().then((value) {
      CommonUtils.showSnackBar(context, 'Logged out!');
      NavigationUtils.clearStack(
        context,
        newRouteName: RouteConstants.auth,
      );
    });
  }
}
