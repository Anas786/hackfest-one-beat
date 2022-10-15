import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

import '../../../data/models/ui/page_arguments.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/log_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../dialogs/progress_dialog.dart';
import '../../helpers/custom_field_helper.dart';
import '../../resources/app_styles.dart';
import '../../resources/app_theme.dart';
import '../../view_models/facility/facility_view_model.dart';
import '../../widgets/facility_item.dart';

class ChooseFacilityPage extends StatefulWidget {
  const ChooseFacilityPage({Key? key}) : super(key: key);

  @override
  State<ChooseFacilityPage> createState() => _ChooseFacilityPageState();
}

class _ChooseFacilityPageState extends State<ChooseFacilityPage> {
  FacilityViewModel? _viewModel;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _viewModel = Provider.of<FacilityViewModel>(context, listen: false);
      _fetchData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return await _onBackPressed();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Choose Facility'),
          titleSpacing: 0,
        ),
        body: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    return Stack(
      children: [
        _buildContent(),
        Consumer<FacilityViewModel>(
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
        _buildSearchBar(),
        Expanded(
          child: Consumer<FacilityViewModel>(
            builder: (context, value, child) {
              return Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView.separated(
                  itemCount: value.facilities?.length ?? 0,
                  itemBuilder: (context, index) {
                    final item = value.facilities?.elementAt(index);
                    return FacilityItem(
                      facility: item,
                      callback: (item) {
                        NavigationUtils.push(
                          context,
                          RouteConstants.chooseDate,
                          args: PageArguments(data: item?.id),
                        );
                      },
                    );
                  },
                  separatorBuilder: (context, index) {
                    return Insets.gapH16;
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.only(left: 8, right: 8),
      child: FormBuilderTextField(
        name: 'search',
        style: CustomFieldHelper.textStyle(AppTheme.primaryTextColor),
        textInputAction: TextInputAction.search,
        decoration: InputDecoration(
          hintText: 'Search',
          prefixIcon: const Icon(
            Icons.search_outlined,
            color: AppTheme.grayColor,
          ),
          hintStyle: CustomFieldHelper.hintStyle(AppTheme.grayColor),
        ).copyWith(
          contentPadding: const EdgeInsets.all(16),
        ),
        onSubmitted: (value) {
          LogUtils.info('Search key: $value');
        },
      ),
    );
  }

  Future<bool> _onBackPressed() async {
    return await CommonUtils.onBackPressed(
      context,
      _viewModel?.isLoading,
    );
  }

  Future<void> _fetchData() async {
    final result = await _viewModel?.getFacilities();
    if (result?.isError == true) {
      if (!mounted) {
        return;
      }
      DialogUtils.showErrorDialog(context, message: result?.errorMessage);
    }
  }
}
