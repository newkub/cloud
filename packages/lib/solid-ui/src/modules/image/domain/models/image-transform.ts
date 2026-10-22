// Image Domain Models - Core image transform and option types

export type ImageFit = "cover" | "contain" | "fill" | "inside" | "outside";

export type ImageFormat = "webp" | "avif" | "jpeg" | "png" | "gif" | "svg";

export type ImageCrop = "top" | "bottom" | "left" | "right" | "center";

export interface ImageTransform {
	readonly width?: number;
	readonly height?: number;
	readonly quality?: number | "auto";
	readonly format?: ImageFormat;
	readonly fit?: ImageFit;
	readonly crop?: ImageCrop;
	readonly blur?: number;
	readonly sharpen?: number;
}

export interface ImageOptions {
	readonly transform: ImageTransform;
	readonly src: string;
	readonly alt?: string;
	readonly loading?: "lazy" | "eager";
	readonly sizes?: string;
	readonly poster?: string;
	readonly provider?: "ipx" | "cloudinary" | "imagekit" | "custom";
	readonly preset?: string;
}

export interface ImagePreset {
	readonly screens?: Record<string, number>;
	readonly presets?: Record<string, PresetDefinition>;
	readonly provider?: string;
}

export interface PresetDefinition {
	readonly transforms: ImageTransform;
}
