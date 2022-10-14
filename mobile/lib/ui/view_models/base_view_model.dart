import 'package:flutter/material.dart';

import '../../data/enums/ui_state.dart';

abstract class BaseViewModel with ChangeNotifier {
  UiState _uiState = UiState.none;
  bool _loading = false;
  String? _displayMessage;

  UiState get uiState => _uiState;
  bool get isLoading => _loading;
  String? get displayMessage => _displayMessage;

  bool get isStateValid => _uiState == UiState.valid;
  bool get isStateNotValid => !isStateValid && _uiState != UiState.none;

  @protected
  set uiState(UiState state) {
    _uiState = state;
    notifyListeners();
  }

  @protected
  void toggleLoading(bool loading) {
    _loading = loading;
    notifyListeners();
  }

  @protected
  set displayMessage(String? message) {
    _displayMessage = message;
    notifyListeners();
  }

  @protected
  void resetObservers() {
    _uiState = UiState.none;
    _displayMessage = null;
    notifyListeners();
  }
}
