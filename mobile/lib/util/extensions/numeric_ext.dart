import 'package:intl/intl.dart';

extension RangeExtension on num {
  bool isBetween(num from, num to) {
    return this >= from && this <= to;
  }
}

extension PriceExtension on num? {
  String formatPrice() {
    final formatter = NumberFormat('###,###,###');
    final formattedPrice = formatter.format(this);
    return '\$ $formattedPrice';
  }
}