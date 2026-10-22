// Image Module - IPX URL Builder
// This module handles IPX URL building

import type { ImageTransform } from "../../models";

export const buildIpxUrl = (src: string, transforms: string): string => {
	// IPX format: /_ipx/[filters]/[src]
	const encodedSrc = encodeURIComponent(src);
	return `/_ipx/${transforms}/${encodedSrc}`;
};

export const buildTransformString = (options: ImageTransform): string => {
	const parts: string[] = [];

	if (options.width) {
		parts.push(`w_${options.width}`);
	}
	if (options.height) {
		parts.push(`h_${options.height}`);
	}
	if (options.fit) {
		parts.push(`fit_${options.fit}`);
	}
	if (options.crop) {
		parts.push(`crop_${options.crop}`);
	}
	if (options.quality) {
		parts.push(`q_${options.quality}`);
	}
	if (options.format) {
		parts.push(`f_${options.format}`);
	}
	if (options.blur) {
		parts.push(`blur_${options.blur}`);
	}
	if (options.sharpen) {
		parts.push(`sharpen_${options.sharpen}`);
	}

	return parts.join(",");
};
