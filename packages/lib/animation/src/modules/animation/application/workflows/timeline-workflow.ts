/**
 * Timeline Workflow - Complex multi-step timeline orchestration
 */

import type { ValidationError } from "../../../../shared/errors/index";
import type { Result } from "../../../../shared/types/index";
import { err } from "../../../../shared/types/index";
import type { TimelineEvent } from "../../domain/events";
import type { TimelineOptions } from "../../domain/models/core/timeline";
import { validateTimelineOptions } from "../../domain/validators";

export interface TimelineWorkflowInput {
	options: TimelineOptions;
}

export interface TimelineWorkflowOutput {
	options: TimelineOptions;
	events: TimelineEvent[];
}

/**
 * Complete timeline workflow - validates and prepares timeline
 */
export const timelineWorkflow = (input: TimelineWorkflowInput): Result<TimelineWorkflowOutput, ValidationError> => {
	// Step 1: Validate options
	const optionsResult = validateTimelineOptions(input.options);
	if (optionsResult._tag === "Err") {
		return err(optionsResult.error);
	}

	// Step 2: Prepare output with default values
	const output: TimelineWorkflowOutput = {
		options: {
			duration: 0,
			delay: 0,
			direction: "normal",
			iterations: 1,
			...optionsResult.data,
		},
		events: [],
	};

	return { _tag: "Ok", success: true, data: output } as Result<TimelineWorkflowOutput, ValidationError>;
};
