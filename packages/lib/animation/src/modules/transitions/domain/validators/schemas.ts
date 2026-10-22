// Transition Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Transition Mode Schema
 */
export const transitionModeSchema = type("'fade' | 'slide' | 'zoom' | 'scale' | 'fade-slide' | 'fade-zoom' | 'none'");

export type TransitionModeSchema = typeof transitionModeSchema.infer;

/**
 * Transition Duration Schema
 */
export const transitionDurationSchema = type("number >= 0").narrow((duration: number) => duration <= 10000);

export type TransitionDuration = typeof transitionDurationSchema.infer;

/**
 * Transition Easing Schema
 */
export const transitionEasingSchema = type("string").narrow((easing: string) => {
	const validEasings = ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier"];
	return validEasings.some((valid) => easing.startsWith(valid));
});

export type TransitionEasing = typeof transitionEasingSchema.infer;

/**
 * Transition Options Schema
 */
export const transitionOptionsSchema = type({
	"mode?": transitionModeSchema,
	"duration?": transitionDurationSchema,
	"easing?": transitionEasingSchema,
});

export type TransitionOptionsSchema = typeof transitionOptionsSchema.infer;

/**
 * CSS Class Name Schema
 */
export const cssClassNameSchema = type(/^[a-zA-Z][a-zA-Z0-9_-]*$/);

export type CssClassName = typeof cssClassNameSchema.infer;
