// Image Module - Srcset Generation
// This module handles srcset generation for different providers

import type { ImageTransform } from "../../models";
import { buildCloudinaryUrl } from "./transforms-cloudinary";
import { buildImagekitUrl } from "./transforms-imagekit";
import { buildIpxUrl, buildTransformString } from "./transforms-ipx";

export const generateSrcsetForProvider = (
	src: string,
	widths: number[],
	options: ImageTransform,
	provider: string,
	providerConfig?: { cloudName?: string; accountId?: string },
): string => {
	const srcsets: string[] = widths.map((width) => {
		const widthOptions = { ...options, width };

		let url: string;
		switch (provider) {
			case "cloudinary":
				url = buildCloudinaryUrl(src, widthOptions, providerConfig?.cloudName);
				break;
			case "imagekit":
				url = buildImagekitUrl(src, widthOptions, providerConfig?.accountId);
				break;
			default:
				url = buildIpxUrl(src, buildTransformString(widthOptions));
				break;
		}

		return `${url} ${width}w`;
	});

	return srcsets.join(", ");
};
