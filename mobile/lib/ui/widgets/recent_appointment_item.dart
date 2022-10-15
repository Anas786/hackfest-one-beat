import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../data/models/entities/appointment.dart';
import '../resources/app_styles.dart';
import '../resources/app_theme.dart';

class RecentAppointmentItem extends StatelessWidget {
  final Appointment? appointment;
  final Function(Appointment? item) callback;

  const RecentAppointmentItem({
    Key? key,
    this.appointment,
    required this.callback,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 300,
      height: 150,
      child: Card(
        elevation: 2,
        shape: const RoundedRectangleBorder(
          borderRadius: Corners.rounded16,
        ),
        child: InkWell(
          borderRadius: Corners.rounded16,
          onTap: () => callback(appointment),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Appointment # ${appointment?.code}',
                  style: Texts.heading3,
                  maxLines: 1,
                ),
                Expanded(
                  child: Text(
                    '${appointment?.readableAppointmentDate} @ ${appointment?.appointmentTime}',
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
                    const Icon(FontAwesomeIcons.briefcaseMedical, size: 20,),
                    Insets.gapW8,
                    Text(
                      '${appointment?.doctor?.fullName}',
                      style: Texts.paragraph1,
                      maxLines: 1,
                    ),
                  ],
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const Icon(FontAwesomeIcons.houseMedical, size: 20,),
                    Insets.gapW8,
                    Text(
                      '${appointment?.facility?.name}',
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
