import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../../util/utilities/log_utils.dart';
import '../models/entities/app_notification.dart';

@pragma('vm:entry-point')
Future<void> _backgroundMessageHandler(RemoteMessage message) async {
  LogUtils.init();
  await Firebase.initializeApp();

  final service = NotificationManager();
  service.logNotification(message.toMap(), 'background');

  if (message.notification == null && message.data.isNotEmpty) {
    await service.onNotificationReceived(
      null,
      message.notification?.title ?? message.data['title'] ?? '',
      message.notification?.body ?? message.data['body'] ?? '',
      message.data.toString(),
    );
  }
}

class NotificationManager {
  NotificationManager._internal();

  factory NotificationManager() => _instance;

  static final NotificationManager _instance = NotificationManager._internal();

  final _firebaseMessaging = FirebaseMessaging.instance;
  final _localNotificationPlugin = FlutterLocalNotificationsPlugin();

  bool _initialized = false;

  Future<void> init(BuildContext context) async {
    try {
      if (!_initialized) {
        _initLocalNotifications();
        _initPermissions();
        _handleEvents();

        _initialized = true;
        LogUtils.info('NotificationService initialized success!');
      }
    } catch (e) {
      LogUtils.error('Error initializing NotificationService: $e');
    }
  }

  Future<void> displayNotification(AppNotification notification) async {
    final details = NotificationDetails(
      android: _getAndroidNotificationDetails(),
      iOS: const DarwinNotificationDetails(),
    );
    await _localNotificationPlugin.show(
      notification.id ?? 0,
      notification.title,
      notification.body,
      details,
      payload: notification.payload,
    );
    LogUtils.info('Notification Shown: ${notification.toJson()}');
  }

  Future<void> cancel(int notificationId) async {
    await _localNotificationPlugin.cancel(notificationId);
  }

  Future<void> cancelAll() async {
    await _localNotificationPlugin.cancelAll();
  }

  Future<String?> getFcmToken() {
    return _firebaseMessaging.getToken();
  }

  Future<void> onNotificationReceived(
    int? id,
    String? title,
    String? body,
    String? payload,
  ) async {
    final notification = AppNotification(
      id: id,
      title: title,
      body: body,
      payload: payload,
    );
    await displayNotification(notification);
  }

  void logNotification(dynamic notification, String source) {
    LogUtils.info(
      'Push Notification [Source, Value]: '
      '[$source, $notification]',
    );
  }

  Future<void> _initLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    final drawinSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
      onDidReceiveLocalNotification: onNotificationReceived,
    );

    final initSettings = InitializationSettings(
      android: androidSettings,
      iOS: drawinSettings,
    );

    await _localNotificationPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onForegroundLocalNotificationTap,
    );
  }

  void _onForegroundLocalNotificationTap(NotificationResponse response) {
    LogUtils.info(
      'Foreground LocalNotification Tapped: '
      '(id=${response.id}, payload=${response.payload})',
    );
  }

  Future<void> _initPermissions() async {
    final settings = await _firebaseMessaging.requestPermission();
    LogUtils.info('Notification Permission: ${settings.authorizationStatus.name}');
  }

  Future<void> _handleEvents() async {
    LogUtils.info('FCM events initialization started!');

    // https://firebase.google.com/docs/cloud-messaging/flutter/client
    // FCM Token Refresh
    FirebaseMessaging.instance.onTokenRefresh.listen((token) async {
      LogUtils.info('FCM refresh token: $token');
    }).onError((e) {
      LogUtils.error('Error fetching FCM refresh token: $e');
    });

    // Foreground
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      logNotification(message.toMap(), 'foreground');
      onNotificationReceived(
        null,
        message.notification?.title ?? message.data['title'] ?? '',
        message.notification?.body ?? message.data['body'] ?? '',
        message.data.toString(),
      );
    });

    // Background
    FirebaseMessaging.onBackgroundMessage(_backgroundMessageHandler);

    // App opened via terminated state
    final initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationInteraction(initialMessage, 'openedViaTerminated');
    }

    // App opened via background state
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleNotificationInteraction(message, 'openedViaBackground');
    });
  }

  void _handleNotificationInteraction(RemoteMessage message, String source) {
    // This can be useful to navigate user to a specific screen
    logNotification(message.toMap(), source);
  }

  AndroidNotificationDetails _getAndroidNotificationDetails() {
    const channelId = 'onebeat_notifications';
    const channelName = 'General Notifications';
    return const AndroidNotificationDetails(
      channelId,
      channelName,
      importance: Importance.high,
      priority: Priority.high,
    );
  }
}
