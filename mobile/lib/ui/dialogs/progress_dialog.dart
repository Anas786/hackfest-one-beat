import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:google_fonts/google_fonts.dart';

import '../resources/app_strings.dart';

class ProgressDialog extends StatelessWidget {
  final bool visible;
  final String? message;
  final bool? dismissible;

  const ProgressDialog({
    Key? key,
    required this.visible,
    this.message = AppStrings.loadingText,
    this.dismissible = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (visible) {
          return dismissible ?? false;
        }
        return true;
      },
      child: LayoutBuilder(builder: (
          BuildContext context,
          BoxConstraints constraints,
          ) {
        return Visibility(
          visible: visible,
          child: Container(
            color: Colors.black54,
            child: Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: _buildLoaderWidget(constraints, context),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildLoaderWidget(BoxConstraints constraints, BuildContext context) {
    if (message?.isNotEmpty ?? false) {
      return Container(
        width: constraints.maxWidth * 0.75,
        height: 96,
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(left: 8),
              child: _buildProgressWidget(context, size: 48),
            ),
            _buildMessageWidget(context),
          ],
        ),
      );
    } else {
      return Container(
        width: 96,
        height: 96,
        color: Colors.white,
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        child: _buildProgressWidget(context, size: 48),
      );
    }
  }

  Widget _buildProgressWidget(BuildContext context, {required double size}) {
    return SpinKitDualRing(
      size: size,
      lineWidth: 4.0,
      color: Theme.of(context).colorScheme.primary,
    );
  }

  Widget _buildMessageWidget(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(left: 32, right: 8),
        child: Text(
          message ?? '',
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.lato(fontSize: 16),
        ),
      ),
    );
  }
}
