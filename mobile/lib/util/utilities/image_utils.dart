import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../ui/resources/app_assets.dart';
import '../../ui/resources/app_theme.dart';
import 'log_utils.dart';

class ImageUtils {
  const ImageUtils._internal();

  static Widget getNetworkImage(
    String? imageUrl, {
    String? placeholder,
    double? width,
    double? height,
    BoxFit? fit,
  }) {
    placeholder = placeholder ?? AppAssets.imgPlaceholder;
    return CachedNetworkImage(
      imageUrl: imageUrl ?? '',
      width: width,
      height: height,
      placeholder: (context, url) {
        return const Center(
          child: CircularProgressIndicator(strokeWidth: 3),
        );
      },
      errorWidget: (context, url, error) {
        LogUtils.error('Image Exception: [Url=$url -> $error]');
        return _getErrorWidget(
          errorImage: placeholder,
          width: width,
          height: height,
          fit: fit,
        );
      },
      fit: fit ?? BoxFit.fill,
    );
  }

  static Widget getLocalImage(
    String? imagePath, {
    String? placeholder,
    double? width,
    double? height,
    BoxFit? fit,
  }) {
    placeholder = placeholder ?? AppAssets.imgPlaceholder;
    return Image.asset(
      imagePath ?? placeholder,
      width: width,
      height: height,
      errorBuilder: (context, error, stackTrace) {
        LogUtils.error(error);
        return _getErrorWidget(
          errorImage: placeholder,
          width: width,
          height: height,
          fit: fit,
        );
      },
      fit: fit ?? BoxFit.fill,
    );
  }

  static Widget getLocalSvgImage(
    String imagePath, {
    double? width,
    double? height,
    BoxFit? fit,
  }) {
    return SvgPicture.asset(
      imagePath,
      width: width,
      height: height,
      fit: fit ?? BoxFit.contain,
    );
  }

  static Widget _getErrorWidget({
    String? errorImage,
    double? width,
    double? height,
    BoxFit? fit,
  }) {
    if (errorImage?.isNotEmpty == true) {
      return Image.asset(
        errorImage!,
        width: width,
        height: height,
        fit: fit ?? BoxFit.fill,
      );
    }
    return const Icon(
      Icons.error,
      color: AppTheme.errorColor,
    );
  }
}
