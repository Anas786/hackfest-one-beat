import 'package:flutter/material.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import '../../../util/utilities/common_utils.dart';
import '../../dialogs/progress_dialog.dart';
import '../../resources/app_strings.dart';
import '../../resources/app_styles.dart';
import '../../view_models/auth/auth_view_model.dart';
import '../../view_models/home/home_view_model.dart';
import '../../widgets/app_drawer.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  HomeViewModel? _homeVM;
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _homeVM = Provider.of<HomeViewModel>(context, listen: false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return await _onBackPressed();
      },
      child: Scaffold(
        key: _scaffoldKey,
        drawer: const AppDrawer(),
        appBar: _buildAppBar(),
        body: _buildBody(),
        floatingActionButton: _buildFAB(),
      ),
    );
  }

  Widget _buildBody() {
    return Stack(
      children: [
        _buildContent(),
        Consumer<HomeViewModel>(
          builder: (context, value, child) {
            return ProgressDialog(
              visible: value.isLoading,
              message: null,
            );
          },
        ),
      ],
    );
  }

  Widget _buildContent() {
    return Column(
      children: [
        Stack(
          children: [
            _buildCurveContainer(),
            _buildUserInfo(),
          ],
        ),
        Expanded(
          child: ScrollConfiguration(
            behavior: const ScrollBehavior().copyWith(overscroll: false),
            child: SingleChildScrollView(
              child: Column(
                children: [],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUserInfo() {
    final authVM = Provider.of<AuthViewModel>(context);
    return Positioned(
      top: 20,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hi, ${authVM.user?.firstName}',
              style: Texts.heading1.copyWith(color: Colors.white),
              maxLines: 1,
              overflow: TextOverflow.fade,
            ),
            Insets.gapH4,
            Text(
              'Welcome to ${AppStrings.appName}',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: Colors.white,
              ),
              maxLines: 1,
              overflow: TextOverflow.fade,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurveContainer() {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      leading: IconButton(
        icon: const Icon(
          Icons.menu_outlined,
          color: Colors.white,
        ),
        onPressed: () => _scaffoldKey.currentState?.openDrawer(),
      ),
      elevation: 0,
      actions: [
        IconButton(
          icon: const Icon(
            Icons.notifications_none_outlined,
            color: Colors.white,
          ),
          onPressed: () {},
        )
      ],
    );
  }

  Widget _buildFAB() {
    return SpeedDial(
      icon: Icons.add,
      activeIcon: Icons.close,
      spacing: 12,
      childPadding: const EdgeInsets.all(6),
      spaceBetweenChildren: 8,
      renderOverlay: false,
      overlayColor: Colors.black,
      overlayOpacity: 0,
      foregroundColor: Colors.white,
      backgroundColor: Theme.of(context).colorScheme.primary,
      activeForegroundColor: Colors.white,
      activeBackgroundColor: Theme.of(context).colorScheme.primary,
      elevation: 8.0,
      animationCurve: Curves.elasticInOut,
      children: [
        SpeedDialChild(
          child: const Icon(Icons.medical_services_outlined),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
          label: AppStrings.bookAppointment,
          labelStyle: Texts.hint,
          onTap: () {},
        ),
        SpeedDialChild(
          child: const Icon(Icons.history_outlined),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
          label: AppStrings.medicalHistory,
          labelStyle: Texts.hint,
          onTap: () {},
        ),
      ],
    );
  }

  Future<bool> _onBackPressed() async {
    if (CommonUtils.isDrawerOpen(_scaffoldKey)) {
      return true;
    }
    return await CommonUtils.onBackPressed(context, _homeVM?.isLoading);
  }
}
