// Image Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type { ImageTransform } from "../models";

/**
 * Image Transform Schema
 */
export const imageTransformSchema = type({
	"width?": "number >= 0",
	"height?": "number >= 0",
	"quality?": type("number >= 0").narrow((quality: number) => quality <= 100),
});

export type ImageTransformSchema = typeof imageTransformSchema.infer;

/**
 * Image URL Schema
 */
export const imageUrlSchema = type("string.url");

export type ImageUrl = typeof imageUrlSchema.infer;

/**
 * Preset Definition Schema
 */
export const presetDefinitionSchema = type({
	transforms: imageTransformSchema,
});

export type PresetDefinition = typeof presetDefinitionSchema.infer;

/**
 * Validate image transform using Arktype
 */
export const validateImageTransform = (transform: ImageTransform): boolean => {
	const result = imageTransformSchema(transform);
	return !(result instanceof type.errors);
};

/**
 * Validate image URL using Arktype
 */
export const validateImageUrl = (url: string): boolean => {
	const result = imageUrlSchema(url);
	return !(result instanceof type.errors);
};

/**
 * Validate preset definition using Arktype
 */
export const validatePresetDefinition = (preset: { transforms: ImageTransform }): boolean => {
	const result = presetDefinitionSchema(preset);
	return !(result instanceof type.errors);
};
