import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../data/models/network/requests/appointment_request.dart';
import '../../../util/constants/app_constants.dart';
import '../../../util/constants/route_constants.dart';
import '../../../util/utilities/common_utils.dart';
import '../../../util/utilities/datetime_utils.dart';
import '../../../util/utilities/dialog_utils.dart';
import '../../../util/utilities/log_utils.dart';
import '../../../util/utilities/navigation_utils.dart';
import '../../components/custom_raised_button.dart';
import '../../components/custom_text_field.dart';
import '../../dialogs/progress_dialog.dart';
import '../../resources/app_strings.dart';
import '../../resources/app_styles.dart';
import '../../resources/app_theme.dart';
import '../../resources/hex_color.dart';
import '../../view_models/appointment/appointment_view_model.dart';

class ChooseDateTimePage extends StatefulWidget {
  final int? facilityId;

  const ChooseDateTimePage({
    Key? key,
    this.facilityId,
  }) : super(key: key);

  @override
  State<ChooseDateTimePage> createState() => _ChooseDateTimePageState();
}

class _ChooseDateTimePageState extends State<ChooseDateTimePage> {
  AppointmentViewModel? _viewModel;
  DateTime? _selectedDate;
  DateTime? _focusedDate;
  String? _selectedTime;
  final _timeController = TextEditingController();

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      _viewModel = Provider.of<AppointmentViewModel>(context, listen: false);
    });
    _focusedDate = DateTime.now();
    super.initState();
  }

  @override
  void dispose() {
    _timeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return await _onBackPressed();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Choose Date & Time'),
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
        Consumer<AppointmentViewModel>(
          builder: (context, value, child) {
            return ProgressDialog(visible: value.isLoading);
          },
        ),
      ],
    );
  }

  Widget _buildContent() {
    return Expanded(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 16,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: double.infinity,
                child: Text(
                  'Select Date',
                  style: Texts.title1,
                ),
              ),
              const Divider(thickness: 1),
              _buildCalendar(),
              const Divider(thickness: 1),
              Insets.gapH8,
              Text(
                'Select Time',
                style: Texts.title1,
              ),
              Insets.gapH8,
              CustomTextField(
                readOnly: true,
                labelText: null,
                hint: AppStrings.select,
                controller: _timeController,
                suffixIcon: Icons.keyboard_arrow_down_outlined,
                onFieldTap: () {
                  CommonUtils.removeCurrentFocus(context);
                  CommonUtils.openTimePicker(
                    context,
                    onTimeSelected: (timeOfDay) {
                      if (timeOfDay != null) {
                        _timeController.text = timeOfDay.format(context);
                        int hour = timeOfDay.hour;
                        String formattedHour = '$hour';
                        if (hour < 10) {
                          formattedHour = '0$hour';
                        }
                        int minute = timeOfDay.minute;
                        String formattedMinute = '$minute';
                        if (minute < 10) {
                          formattedMinute = '0$minute';
                        }
                        _selectedTime = '$formattedHour:$formattedMinute:00';
                        LogUtils.info('Selected Time: $_selectedTime');
                      }
                    },
                  );
                },
              ),
              Insets.gapH24,
              CustomRaisedButton(
                AppStrings.bookAppointment,
                width: MediaQuery.of(context).size.width,
                onPressed: _submit,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCalendar() {
    return TableCalendar(
      calendarStyle: CalendarStyle(
        cellMargin: const EdgeInsets.all(8),
        outsideDaysVisible: false,
        defaultDecoration: _calendarBoxDecoration().copyWith(
          color: AppTheme.vacantDateColor,
        ),
        defaultTextStyle: GoogleFonts.poppins(color: HexColor('#555555')),
        selectedDecoration: _calendarBoxDecoration().copyWith(
          color: AppTheme.selectedDateColor,
        ),
        selectedTextStyle: GoogleFonts.poppins(color: Colors.white),
        todayDecoration: _calendarBoxDecoration().copyWith(
          color: Theme.of(context).colorScheme.primary,
        ),
        todayTextStyle: GoogleFonts.poppins(color: Colors.white),
        disabledDecoration: _calendarBoxDecoration(),
        disabledTextStyle: GoogleFonts.poppins(
          color: AppTheme.disabledDateTextColor,
        ),
      ),
      headerStyle: HeaderStyle(
        titleCentered: true,
        formatButtonVisible: false,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        leftChevronMargin: const EdgeInsets.symmetric(horizontal: 0),
        rightChevronMargin: const EdgeInsets.symmetric(horizontal: 0),
      ),
      firstDay: DateTime.now(),
      lastDay: DateTime(2022, 11, 16),
      focusedDay: _focusedDate ?? DateTime.now(),
      rangeSelectionMode: RangeSelectionMode.disabled,
      availableGestures: AvailableGestures.horizontalSwipe,
      weekendDays: const [],
      rowHeight: 48,
      daysOfWeekHeight: 32,
      daysOfWeekStyle: DaysOfWeekStyle(
        weekdayStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        weekendStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        decoration: const BoxDecoration(
          color: AppTheme.calendarDowHeaderColor,
        ),
      ),
      selectedDayPredicate: (day) {
        return isSameDay(_selectedDate, day);
      },
      onDaySelected: (selectedDay, focusedDay) {
        if (!isSameDay(_selectedDate, selectedDay)) {
          setState(() {
            _selectedDate = selectedDay;
            _focusedDate = focusedDay;
          });
        }
      },
      onPageChanged: (focusedDay) {
        _focusedDate = focusedDay;
      },
    );
  }

  BoxDecoration _calendarBoxDecoration() {
    return const BoxDecoration(
      shape: BoxShape.circle,
    );
  }

  String? _formattedDate(
    DateTime? dateTime, {
    String pattern = AppConstants.dateRequestFormat,
  }) {
    return DateTimeUtils.format(
      pattern,
      dateTime,
    );
  }

  Future<bool> _onBackPressed() async {
    return await CommonUtils.onBackPressed(
      context,
      _viewModel?.isLoading,
    );
  }

  void _submit() async {
    if (_selectedDate == null) {
      DialogUtils.showErrorDialog(
        context,
        message: 'Please select a date.',
      );
      return;
    }

    if (_selectedTime == null) {
      DialogUtils.showErrorDialog(
        context,
        message: 'Please select a time.',
      );
      return;
    }

    final request = AppointmentRequest(
      patientId: 2,
      facilityId: widget.facilityId,
      doctorId: 13,
      appointmentDate: _formattedDate(_selectedDate),
      appointmentTime: _selectedTime,
    );
    final result = await _viewModel?.create(request);
    if (!mounted) {
      return;
    }
    if (result?.isSuccess ?? false) {
      DialogUtils.showInfoDialog(
        context,
        message: result?.message,
        callback: () {
          NavigationUtils.clearStack(
            context,
            newRouteName: RouteConstants.home,
          );
        },
      );
    } else {
      DialogUtils.showErrorDialog(context, message: result?.errorMessage);
    }
  }
}
