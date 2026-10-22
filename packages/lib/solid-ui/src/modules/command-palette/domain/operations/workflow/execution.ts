/**
 * Workflow Execution Operations - Domain operations for executing workflows
 */

import type { Command } from "../../../types/command";
import type {
	Workflow,
	WorkflowExecution,
	WorkflowStep,
	WorkflowStepResult,
} from "../../../types/integration/workflow";

export const executeWorkflowStep = async (
	step: WorkflowStep,
	commands: readonly Command[],
): Promise<WorkflowStepResult> => {
	const startTime = Date.now();
	const command = commands.find((c) => c.id === step.commandId);

	if (!command) {
		return {
			stepId: step.id,
			success: false,
			error: `Command not found: ${step.commandId}`,
			executedAt: new Date(),
			executionTime: Date.now() - startTime,
		};
	}

	// Apply delay if specified
	if (step.delay && step.delay > 0) {
		await new Promise((resolve) => setTimeout(resolve, step.delay));
	}

	try {
		// Execute command action
		if (command.action.type === "function") {
			const handler = command.action.payload as () => void | Promise<void>;
			await handler();
		}

		return {
			stepId: step.id,
			success: true,
			result: "Command executed successfully",
			executedAt: new Date(),
			executionTime: Date.now() - startTime,
		};
	} catch (error) {
		return {
			stepId: step.id,
			success: false,
			error: error instanceof Error ? error.message : String(error),
			executedAt: new Date(),
			executionTime: Date.now() - startTime,
		};
	}
};

export const executeWorkflow = async (workflow: Workflow, commands: readonly Command[]): Promise<WorkflowExecution> => {
	let currentStepIndex = 0;
	const results: WorkflowStepResult[] = [];
	let status: "pending" | "running" | "completed" | "failed" | "cancelled" = "running";
	let error: string | undefined;
	let completedAt: Date | undefined;

	for (let i = 0; i < workflow.steps.length; i++) {
		const step = workflow.steps[i];
		if (!step) continue;

		currentStepIndex = i;

		const result = await executeWorkflowStep(step, commands);
		results.push(result);

		// Check if step failed and error handling is stop
		if (!result.success && step.onError?.type === "stop") {
			status = "failed";
			error = result.error;
			completedAt = new Date();
			break;
		}

		// Check condition for next step
		if (step.condition) {
			const shouldContinue = evaluateCondition(step.condition, result);
			if (!shouldContinue) {
				break;
			}
		}
	}

	if (status === "running") {
		status = "completed";
		completedAt = new Date();
	}

	const execution: WorkflowExecution = {
		id: `execution-${Date.now()}`,
		workflowId: workflow.id,
		status,
		currentStepIndex,
		results,
		startedAt: new Date(),
		completedAt,
		error,
	};

	return execution;
};

export const evaluateCondition = (condition: WorkflowStep["condition"], result: WorkflowStepResult): boolean => {
	if (!condition) return true;

	switch (condition.type) {
		case "success":
			return result.success;
		case "failure":
			return !result.success;
		case "always":
			return true;
		case "custom":
			if (condition.evaluator) {
				try {
					return condition.evaluator(result as unknown as Record<string, unknown>);
				} catch (_error) {
					return false;
				}
			}
			return true;
		default:
			return true;
	}
};
