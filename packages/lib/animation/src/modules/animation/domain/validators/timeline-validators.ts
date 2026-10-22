/**
 * Timeline Validators - Domain validation functions for timeline
 */

import { createValidationError, type ValidationError } from "../../../../shared/errors";
import type { Result } from "../../../../shared/types";
import type { TimelineOptions } from "../models/core/timeline";

/**
 * Validate timeline options
 */
export const validateTimelineOptions = (options: TimelineOptions): Result<TimelineOptions, ValidationError> => {
	if (options.duration !== undefined) {
		if (typeof options.duration !== "number") {
			const error = createValidationError("Duration must be a number", "duration", {
				value: options.duration,
			});
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
		if (options.duration < 0) {
			const error = createValidationError("Duration must be non-negative", "duration", { value: options.duration });
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
	}

	if (options.delay !== undefined) {
		if (typeof options.delay !== "number") {
			const error = createValidationError("Delay must be a number", "delay", {
				value: options.delay,
			});
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
		if (options.delay < 0) {
			const error = createValidationError("Delay must be non-negative", "delay", {
				value: options.delay,
			});
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
	}

	if (options.iterations !== undefined) {
		if (typeof options.iterations !== "number") {
			const error = createValidationError("Iterations must be a number", "iterations", { value: options.iterations });
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
		if (options.iterations < 0) {
			const error = createValidationError("Iterations must be non-negative", "iterations", {
				value: options.iterations,
			});
			return { _tag: "Err", success: false, error } as Result<TimelineOptions, ValidationError>;
		}
	}

	return { _tag: "Ok", success: true, data: options } as Result<TimelineOptions, ValidationError>;
};
