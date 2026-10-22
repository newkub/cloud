// Image Module - Application Layer
// Functional image service

import {
	buildCloudinaryUrl,
	buildImagekitUrl,
	buildIpxUrl,
	buildTransformString,
	DEFAULT_SCREENS,
	generateBlurPlaceholder,
	generateSizes,
	generateSrcsetForProvider,
	generateWidths,
	mergePresetWithOptions,
	normalizeTransform,
	resolvePreset,
} from "../domain";
import type { ImageTransform } from "../domain/models";

export interface ImageServiceConfig {
	readonly provider: "ipx" | "cloudinary" | "imagekit" | "custom";
	readonly cloudName?: string;
	readonly accountId?: string;
	readonly baseURL?: string;
}

// Create image service config
export const createImageServiceConfig = (config: Partial<ImageServiceConfig> = {}): ImageServiceConfig => {
	const imageConfig: ImageServiceConfig = {
		provider: config.provider || "ipx",
	};
	if (config.cloudName) (imageConfig as { cloudName: string }).cloudName = config.cloudName;
	if (config.accountId) (imageConfig as { accountId: string }).accountId = config.accountId;
	if (config.baseURL) (imageConfig as { baseURL: string }).baseURL = config.baseURL;
	return imageConfig;
};

// Get image URL
export const getImageUrl = (config: ImageServiceConfig, src: string, options?: ImageTransform): string => {
	const normalized = normalizeTransform(options || {});

	switch (config.provider) {
		case "cloudinary":
			return buildCloudinaryUrl(src, normalized, config.cloudName);
		case "imagekit":
			return buildImagekitUrl(src, normalized, config.accountId);
		default: {
			const transforms = buildTransformString(normalized);
			return buildIpxUrl(src, transforms);
		}
	}
};

// Generate srcset
export const generateSrcset = (
	config: ImageServiceConfig,
	src: string,
	sizes: number[],
	options?: ImageTransform,
): string => {
	const providerConfig: { cloudName?: string; accountId?: string } = {};
	if (config.cloudName) providerConfig.cloudName = config.cloudName;
	if (config.accountId) providerConfig.accountId = config.accountId;
	return generateSrcsetForProvider(src, sizes, options || {}, config.provider, providerConfig);
};

// Generate default srcset
export const generateDefaultSrcset = (config: ImageServiceConfig, src: string, baseWidth: number = 640): string => {
	const widths = generateWidths(baseWidth);
	return generateSrcset(config, src, widths);
};

// Generate blurhash placeholder
export const generateBlurhash = (src: string): string => generateBlurPlaceholder(src, 10, 10);

// Generate preset srcset
export const generatePresetSrcset = (
	config: ImageServiceConfig,
	src: string,
	presetName: string,
	presetDefinitions: Record<string, { transforms: ImageTransform }>,
): string => {
	const preset = resolvePreset(presetName, presetDefinitions);
	if (!preset) {
		return generateDefaultSrcset(config, src);
	}

	const options = mergePresetWithOptions(preset, {});
	const widths = generateWidths(options.width || 640);

	const providerConfig: { cloudName?: string; accountId?: string } = {};
	if (config.cloudName) providerConfig.cloudName = config.cloudName;
	if (config.accountId) providerConfig.accountId = config.accountId;
	return generateSrcsetForProvider(src, widths, options, config.provider, providerConfig);
};

// Get provider config
export const getProviderConfig = (config: ImageServiceConfig): ImageServiceConfig => config;

// Create image URL (alias for getImageUrl)
export const createImageUrl = (config: ImageServiceConfig, src: string, options: ImageTransform): string =>
	getImageUrl(config, src, options);

// Create responsive image
export const createResponsiveImage = (
	config: ImageServiceConfig,
	src: string,
	options: ImageTransform & { width?: number; sizes?: string },
): {
	url: string;
	srcset: string;
	sizes: string;
	placeholder: string;
} => {
	const sizesAttr = generateSizes(DEFAULT_SCREENS, options.sizes);
	const widths = generateWidths(options.width || 640);

	return {
		url: getImageUrl(config, src, options),
		srcset: generateSrcset(config, src, widths, options),
		sizes: sizesAttr,
		placeholder: generateBlurhash(src),
	};
};
