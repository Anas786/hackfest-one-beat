import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'package:store_redirect/store_redirect.dart';

import '../../../data/models/entities/user.dart';
import '../../../util/constants/app_constants.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/extensions/uri_ext.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../util/utilities/image_utils.dart';
import '../resources/app_assets.dart';
import '../resources/app_strings.dart';
import '../resources/app_styles.dart';
import '../resources/app_theme.dart';
import '../view_models/auth/auth_view_model.dart';

class AppDrawer extends StatefulWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  AuthViewModel? _viewModel;
  final _user = ValueNotifier<User?>(null);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _viewModel = Provider.of<AuthViewModel>(context, listen: false);
      _loadUser();
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Drawer(
        child: Column(
          children: [
            _buildNavWidget(context),
            _buildVersionWidget(context),
          ],
        ),
      ),
    );
  }

  Widget _buildNavWidget(BuildContext context) {
    return Expanded(
      child: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 8),
              child: ValueListenableBuilder<User?>(
                valueListenable: _user,
                builder: (context, value, child) {
                  return _buildNavHeader(context, value);
                },
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Divider(thickness: 1),
            ),
            ..._buildNavItems(context),
          ],
        ),
      ),
    );
  }

  Widget _buildNavHeader(BuildContext context, User? user) {
    return ListTile(
      horizontalTitleGap: 0,
      leading: Container(
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          border: Border.all(color: AppTheme.darkGrayColor),
          borderRadius: BorderRadius.circular(32),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: ImageUtils.getLocalImage(
            AppAssets.imgAvatarPlaceholder,
          ),
        ),
      ),
      title: Text(
        user?.fullName ?? '',
        overflow: TextOverflow.fade,
        maxLines: 1,
        style: Texts.title1,
      ),
      subtitle: Text(
        user?.userName ?? user?.email ?? '',
        overflow: TextOverflow.fade,
        maxLines: 1,
        style: Texts.hint.copyWith(color: AppTheme.darkGrayColor),
      ),
      // trailing: IconButton(
      //   icon: const Icon(
      //     Icons.clear,
      //     color: AppTheme.darkGrayColor,
      //   ),
      //   onPressed: () => _closeDrawer(context),
      // ),
    );
  }

  List<Widget> _buildNavItems(BuildContext context) {
    const divider = Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Divider(thickness: 1),
    );
    final myAppointments = _buildDrawerItemWidget(
      context,
      Icons.perm_contact_calendar_outlined,
      AppStrings.myAppointments,
      () {},
    );
    final editProfile = _buildDrawerItemWidget(
      context,
      Icons.edit_note_outlined,
      AppStrings.editProfile,
      () {},
    );
    final changePassword = _buildDrawerItemWidget(
      context,
      Icons.lock_person_outlined,
      AppStrings.changePassword,
      () {},
    );
    final rateUs = _buildDrawerItemWidget(
      context,
      Icons.rate_review_outlined,
      AppStrings.rateUs,
      () => StoreRedirect.redirect(),
    );
    final support = _buildDrawerItemWidget(
      context,
      Icons.language_outlined,
      AppStrings.support,
      () async {
        await Uri.parse(AppConstants.supportUrl).launchInBrowser();
      },
    );
    final signOut = _buildDrawerItemWidget(
      context,
      Icons.exit_to_app_outlined,
      AppStrings.logout,
      () => _onLogout(context),
    );

    List<Widget> navItems = [
      myAppointments,
      editProfile,
      changePassword,
      divider,
      rateUs,
      support,
      signOut,
    ];

    return navItems;
  }

  Widget _buildDrawerItemWidget(
    BuildContext context,
    IconData icon,
    String title,
    VoidCallback onTapCallback,
  ) {
    return ListTile(
      visualDensity: const VisualDensity(horizontal: 0, vertical: -2),
      horizontalTitleGap: 0,
      leading: Icon(
        icon,
        color: Theme.of(context).colorScheme.primary,
      ),
      title: Text(
        title,
        style: Texts.paragraph1.copyWith(
          fontWeight: FontWeight.w400,
          color: AppTheme.primaryTextColor,
        ),
      ),
      onTap: () {
        _closeDrawer(context);
        onTapCallback();
      },
    );
  }

  Widget _buildVersionWidget(BuildContext context) {
    return FutureBuilder<String>(
      future: CommonUtils.getAppVersion(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                const Divider(thickness: 1),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '${AppStrings.app_version}: ',
                      style: Texts.paragraph1
                          .copyWith(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      snapshot.data ?? '',
                      style: Texts.paragraph1,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
              ],
            ),
          );
        }
        return Container();
      },
    );
  }

  Future<void> _loadUser() async {
    _user.value = await _viewModel?.getAuthUser();
  }

  void _closeDrawer(BuildContext context) {
    NavigationUtils.pop(context);
  }

  void _onLogout(BuildContext context) {
    _viewModel?.logout().then((value) {
      NavigationUtils.clearStack(
        context,
        newRouteName: RouteConstants.login,
      );
    });
  }
}
