import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../util/utilities/common_utils.dart';
import '../../dialogs/progress_dialog.dart';
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
        appBar: AppBar(),
        drawer: const AppDrawer(),
        body: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    return Stack(
      children: [
        SingleChildScrollView(child: _buildContent()),
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
      children: [],
    );
  }

  Future<bool> _onBackPressed() async {
    if (CommonUtils.isDrawerOpen(_scaffoldKey)) {
      return true;
    }
    return await CommonUtils.onBackPressed(context, _homeVM?.isLoading);
  }
}
