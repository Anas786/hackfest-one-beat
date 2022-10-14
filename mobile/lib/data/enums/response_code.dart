// This holds custom response code only in case of network exception
enum ResponseCode {
  timeout(408),
  internetFailure(-2),
  unknown(-3);

  const ResponseCode(this.value);

  final int value;
}