/**
 * Animation Validators - Domain validation functions
 */

import { createValidationError, type ValidationError } from "../../../../shared/errors";
import type { Result } from "../../../../shared/types";
import type { AnimationOptions, AnimationProperties } from "../models/core/animation";

/**
 * Validate animation properties
 */
export const validateProperties = (properties: AnimationProperties): Result<AnimationProperties, ValidationError> => {
	if (properties.opacity !== undefined) {
		if (typeof properties.opacity !== "number") {
			const error = createValidationError("Opacity must be a number", "opacity", {
				value: properties.opacity,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationProperties, ValidationError>;
		}
		if (properties.opacity < 0 || properties.opacity > 1) {
			const error = createValidationError("Opacity must be between 0 and 1", "opacity", { value: properties.opacity });
			return { _tag: "Err", success: false, error } as Result<AnimationProperties, ValidationError>;
		}
	}

	if (properties.scale !== undefined) {
		if (typeof properties.scale !== "number") {
			const error = createValidationError("Scale must be a number", "scale", {
				value: properties.scale,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationProperties, ValidationError>;
		}
		if (properties.scale < 0) {
			const error = createValidationError("Scale must be non-negative", "scale", {
				value: properties.scale,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationProperties, ValidationError>;
		}
	}

	if (properties.rotate !== undefined) {
		if (typeof properties.rotate !== "number" && typeof properties.rotate !== "string") {
			const error = createValidationError("Rotate must be a number or string", "rotate", { value: properties.rotate });
			return { _tag: "Err", success: false, error } as Result<AnimationProperties, ValidationError>;
		}
	}

	return { _tag: "Ok", success: true, data: properties } as Result<AnimationProperties, ValidationError>;
};

/**
 * Validate animation options
 */
export const validateOptions = (options: AnimationOptions): Result<AnimationOptions, ValidationError> => {
	if (options.duration !== undefined) {
		if (typeof options.duration !== "number") {
			const error = createValidationError("Duration must be a number", "duration", {
				value: options.duration,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
		if (options.duration < 0) {
			const error = createValidationError("Duration must be non-negative", "duration", { value: options.duration });
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
	}

	if (options.delay !== undefined) {
		if (typeof options.delay !== "number") {
			const error = createValidationError("Delay must be a number", "delay", {
				value: options.delay,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
		if (options.delay < 0) {
			const error = createValidationError("Delay must be non-negative", "delay", {
				value: options.delay,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
	}

	if (options.iterations !== undefined) {
		if (typeof options.iterations !== "number") {
			const error = createValidationError("Iterations must be a number", "iterations", { value: options.iterations });
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
		if (options.iterations < 0) {
			const error = createValidationError("Iterations must be non-negative", "iterations", {
				value: options.iterations,
			});
			return { _tag: "Err", success: false, error } as Result<AnimationOptions, ValidationError>;
		}
	}

	return { _tag: "Ok", success: true, data: options } as Result<AnimationOptions, ValidationError>;
};

/**
 * Validate easing function name
 */
export const validateEasing = (easing: string): Result<string, ValidationError> => {
	const validEasings = [
		"linear",
		"easeInQuad",
		"easeOutQuad",
		"easeInOutQuad",
		"easeInCubic",
		"easeOutCubic",
		"easeInOutCubic",
		"easeInElastic",
		"easeOutElastic",
		"easeInOutElastic",
		"easeInBounce",
		"easeOutBounce",
		"easeInOutBounce",
	];

	if (!validEasings.includes(easing)) {
		const error = createValidationError(`Invalid easing function: ${easing}`, "easing", { value: easing });
		return { _tag: "Err", success: false, error } as Result<string, ValidationError>;
	}

	return { _tag: "Ok", success: true, data: easing } as Result<string, ValidationError>;
};
