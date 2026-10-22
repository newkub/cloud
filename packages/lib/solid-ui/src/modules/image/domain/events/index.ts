// Image Domain Events
// Domain event types for image operations

import type { ImageTransform } from "../models";

export type ImageEventType =
	| "imageTransformApplied"
	| "imageUrlGenerated"
	| "srcsetGenerated"
	| "presetResolved"
	| "blurhashGenerated"
	| "transformNormalized";

export interface ImageEventData {
	src?: string;
	transform?: ImageTransform;
	url?: string;
	srcset?: string;
	presetName?: string;
	blurhash?: string;
	provider?: "ipx" | "cloudinary" | "imagekit" | "custom";
}

export interface ImageEvent {
	type: ImageEventType;
	data: ImageEventData;
	timestamp: number;
}
