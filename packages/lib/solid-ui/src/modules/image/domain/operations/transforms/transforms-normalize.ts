// Image Module - Transform Normalization
// This module handles transform option normalization

import type { ImageFit, ImageFormat, ImageTransform } from "../../models";

export const DEFAULT_FORMAT: ImageFormat = "webp";
export const DEFAULT_QUALITY = 80;
export const DEFAULT_FIT: ImageFit = "cover";

export const normalizeTransform = (
	options: ImageTransform,
): Required<ImageTransform> & {
	format: ImageFormat;
	quality: number;
	fit: ImageFit;
} => {
	return {
		width: options.width ?? 0,
		height: options.height ?? 0,
		quality: options.quality === "auto" ? DEFAULT_QUALITY : (options.quality ?? DEFAULT_QUALITY),
		format: options.format ?? DEFAULT_FORMAT,
		fit: options.fit ?? DEFAULT_FIT,
		crop: options.crop ?? "center",
		blur: options.blur ?? 0,
		sharpen: options.sharpen ?? 0,
	};
};
