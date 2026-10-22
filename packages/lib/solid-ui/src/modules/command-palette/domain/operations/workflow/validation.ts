/**
 * Workflow Validation Operations - Domain operations for validating workflows
 */

import type { Result } from "../../../shared/types";
import type { Workflow } from "../../../types/integration/workflow";

export const validateWorkflow = (workflow: Workflow): Result<Workflow> => {
	if (!workflow.id || workflow.id.trim().length === 0) {
		return { success: false, error: new Error("Workflow ID is required") };
	}

	if (!workflow.name || workflow.name.trim().length === 0) {
		return { success: false, error: new Error("Workflow name is required") };
	}

	if (workflow.steps.length === 0) {
		return {
			success: false,
			error: new Error("Workflow must have at least one step"),
		};
	}

	// Validate each step
	for (const step of workflow.steps) {
		if (!step.id || step.id.trim().length === 0) {
			return { success: false, error: new Error("Step ID is required") };
		}

		if (!step.commandId || step.commandId.trim().length === 0) {
			return {
				success: false,
				error: new Error("Step command ID is required"),
			};
		}

		if (step.order < 0) {
			return {
				success: false,
				error: new Error("Step order must be non-negative"),
			};
		}

		if (step.delay !== undefined && step.delay < 0) {
			return {
				success: false,
				error: new Error("Step delay must be non-negative"),
			};
		}
	}

	// Validate triggers
	for (const trigger of workflow.triggers) {
		if (!trigger.type) {
			return { success: false, error: new Error("Trigger type is required") };
		}

		if (!["manual", "command", "schedule", "event"].includes(trigger.type)) {
			return {
				success: false,
				error: new Error(`Invalid trigger type: ${trigger.type}`),
			};
		}
	}

	return { success: true, data: workflow };
};
