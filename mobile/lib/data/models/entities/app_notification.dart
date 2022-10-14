import 'package:flutter/widgets.dart';

import '../base_model.dart';

class AppNotification implements BaseModel {
  int? id;
  String? title;
  String? body;
  String? payload;

  AppNotification({
    required this.id,
    this.title,
    this.body,
    this.payload,
  }) {
   id ??= UniqueKey().hashCode;
  }

  @override
  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    data['id'] = id;
    data['title'] = title;
    data['body'] = body;
    data['payload'] = payload;
    return data;
  }
}
