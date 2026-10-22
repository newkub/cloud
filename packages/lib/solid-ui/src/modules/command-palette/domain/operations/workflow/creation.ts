/**
 * Workflow Creation Operations - Domain operations for creating workflows
 */

import { Effect } from "effect";
import type { Result } from "../../../shared/types";
import type { Workflow, WorkflowStep, WorkflowTrigger } from "../../../types/integration/workflow";

export const createWorkflow = (
	name: string,
	steps: readonly WorkflowStep[],
	triggers: readonly WorkflowTrigger[],
): Result<Workflow> => {
	if (!name || name.trim().length === 0) {
		return { success: false, error: new Error("Workflow name is required") };
	}

	if (steps.length === 0) {
		return {
			success: false,
			error: new Error("Workflow must have at least one step"),
		};
	}

	const workflow: Workflow = {
		id: `workflow-${Date.now()}`,
		name: name.trim(),
		steps: [...steps].sort((a, b) => a.order - b.order),
		triggers,
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return { success: true, data: workflow };
};

export const createWorkflowEffect = (
	name: string,
	steps: readonly WorkflowStep[],
	triggers: readonly WorkflowTrigger[],
): Effect.Effect<Workflow, Error, never> => {
	return Effect.sync(() => {
		const result = createWorkflow(name, steps, triggers);
		if (!result.success) {
			throw (result as { success: false; error: Error }).error;
		}
		return result.data;
	});
};
