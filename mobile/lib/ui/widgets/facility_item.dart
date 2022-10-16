import 'package:flutter/material.dart';

import '../../data/models/entities/facility.dart';
import '../resources/app_styles.dart';
import '../resources/app_theme.dart';

class FacilityItem extends StatelessWidget {
  final Facility? facility;
  final Function(Facility? item) callback;

  const FacilityItem({
    Key? key,
    this.facility,
    required this.callback,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 188,
      child: Card(
        elevation: 2,
        shape: const RoundedRectangleBorder(
          borderRadius: Corners.rounded16,
        ),
        child: InkWell(
          borderRadius: Corners.rounded16,
          onTap: () => callback(facility),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  facility?.name ?? '',
                  style: Texts.heading3,
                  maxLines: 1,
                ),
                Text(
                  facility?.address ?? '',
                  style: Texts.paragraph1.copyWith(
                    color: AppTheme.darkGrayColor,
                  ),
                  maxLines: 2,
                ),
                Expanded(
                  child: Text(
                    '${facility?.city}, ${facility?.state}',
                    style: Texts.paragraph1.copyWith(
                      color: AppTheme.darkGrayColor,
                    ),
                    maxLines: 1,
                  ),
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const Icon(Icons.email_outlined, size: 20,),
                    Insets.gapW8,
                    Text(
                      facility?.email ?? '',
                      style: Texts.paragraph1,
                      maxLines: 1,
                    ),
                  ],
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const Icon(Icons.local_phone_outlined, size: 20,),
                    Insets.gapW8,
                    Text(
                      facility?.phone ?? '',
                      style: Texts.paragraph1,
                      maxLines: 1,
                    ),
                  ],
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const Icon(Icons.location_on_outlined, size: 20,),
                    Insets.gapW8,
                    Text(
                      '12KMs',
                      style: Texts.paragraph1,
                      maxLines: 1,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
