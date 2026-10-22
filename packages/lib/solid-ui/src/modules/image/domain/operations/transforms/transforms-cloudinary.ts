// Image Module - Cloudinary URL Builder
// This module handles Cloudinary URL building

import { CLOUDINARY_FETCH_BASE_URL, DEFAULT_CLOUDINARY_CLOUD_NAME } from "../../../constants";
import type { ImageTransform } from "../../models";
import { normalizeTransform } from "./transforms-normalize";

export const buildCloudinaryUrl = (src: string, options: ImageTransform, cloudName?: string): string => {
	const normalized = normalizeTransform(options);
	const transforms: string[] = [];

	if (normalized.width) transforms.push(`w_${normalized.width}`);
	if (normalized.height) transforms.push(`h_${normalized.height}`);
	if (normalized.fit) transforms.push(`c_${normalized.fit}`);
	if (normalized.quality) transforms.push(`q_${normalized.quality}`);
	if (normalized.format) transforms.push(`f_${normalized.format}`);
	if (normalized.blur) transforms.push(`e_blur:${normalized.blur}`);
	if (normalized.sharpen) transforms.push(`e_sharpen:${normalized.sharpen}`);

	const transformString = transforms.length > 0 ? `${transforms.join(",")}/` : "";
	const cloud = cloudName || DEFAULT_CLOUDINARY_CLOUD_NAME;

	// Check if src is already a full URL
	if (src.startsWith("http")) {
		return `${CLOUDINARY_FETCH_BASE_URL}/${cloud}/image/fetch/${transformString}${src}`;
	}

	return `${CLOUDINARY_FETCH_BASE_URL}/${cloud}/image/upload/${transformString}${src}`;
};
