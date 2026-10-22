// Image Module - Preset Resolution
// This module handles preset resolution and merging

import type { ImageTransform, PresetDefinition } from "../../models";

export const DEFAULT_PRESETS: Record<string, PresetDefinition> = {
	thumbnail: {
		transforms: { width: 200, height: 200, fit: "cover", format: "webp" },
	},
	medium: {
		transforms: { width: 640, height: 480, fit: "contain", format: "webp" },
	},
	large: {
		transforms: { width: 1200, height: 900, fit: "contain", format: "webp" },
	},
	avatar: {
		transforms: {
			width: 80,
			height: 80,
			fit: "cover",
			crop: "center",
			format: "webp",
		},
	},
	social: {
		transforms: { width: 1200, height: 630, fit: "cover", format: "jpeg" },
	},
};

export const resolvePreset = (
	presetName: string,
	customPresets?: Record<string, PresetDefinition>,
): PresetDefinition | undefined => {
	return customPresets?.[presetName] || DEFAULT_PRESETS[presetName];
};

export const mergePresetWithOptions = (preset: PresetDefinition, options: ImageTransform): ImageTransform => {
	return {
		...preset.transforms,
		...options,
	};
};
