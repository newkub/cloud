/**
 * Animation Workflow - Complex multi-step animation orchestration
 */

import type { ValidationError } from "../../../../shared/errors/index";
import type { Result } from "../../../../shared/types/index";
import type { AnimationEvent } from "../../domain/events";
import type { AnimationOptions, AnimationProperties } from "../../domain/models/core/animation";
import { validateEasing, validateOptions, validateProperties } from "../../domain/validators";

export interface AnimationWorkflowInput {
	properties: AnimationProperties;
	options: AnimationOptions;
	easing?: string;
}

export interface AnimationWorkflowOutput {
	properties: AnimationProperties;
	options: AnimationOptions;
	easing: string;
	events: AnimationEvent[];
}

/**
 * Complete animation workflow - validates and prepares animation
 */
export const animationWorkflow = (input: AnimationWorkflowInput): Result<AnimationWorkflowOutput, ValidationError> => {
	// Step 1: Validate properties
	const propertiesResult = validateProperties(input.properties);
	if (propertiesResult._tag === "Err") {
		return {
			_tag: "Err",
			success: false,
			error: propertiesResult.error,
		} as Result<AnimationWorkflowOutput, ValidationError>;
	}

	// Step 2: Validate options
	const optionsResult = validateOptions(input.options);
	if (optionsResult._tag === "Err") {
		return {
			_tag: "Err",
			success: false,
			error: optionsResult.error,
		} as Result<AnimationWorkflowOutput, ValidationError>;
	}

	// Step 3: Validate easing (if provided)
	let easing = input.easing || "easeOutQuad";
	if (input.easing) {
		const easingResult = validateEasing(input.easing);
		if (easingResult._tag === "Err") {
			return {
				_tag: "Err",
				success: false,
				error: easingResult.error,
			} as Result<AnimationWorkflowOutput, ValidationError>;
		}
		if (easingResult._tag === "Ok") {
			easing = easingResult.data;
		}
	}

	// Step 4: Prepare output with default values
	const output: AnimationWorkflowOutput = {
		properties: propertiesResult.data,
		options: {
			duration: 1000,
			delay: 0,
			easing,
			direction: "normal",
			iterations: 1,
			fill: "forwards",
			...optionsResult.data,
		},
		easing,
		events: [],
	};

	return { _tag: "Ok", success: true, data: output } as Result<AnimationWorkflowOutput, ValidationError>;
};
