/**
 * Workflow Engine Port - Interface for workflow automation
 */

import type { Command } from "../../types";
import type { Workflow, WorkflowExecution, WorkflowStep, WorkflowTrigger } from "../../types/integration/workflow";

export interface WorkflowEngine {
	createWorkflow(name: string, steps: readonly WorkflowStep[], triggers: readonly WorkflowTrigger[]): Workflow;
	executeWorkflow(workflow: Workflow, commands: readonly Command[]): Promise<WorkflowExecution>;
	getExecution(executionId: string): WorkflowExecution | undefined;
	cancelExecution(executionId: string): boolean;
}
