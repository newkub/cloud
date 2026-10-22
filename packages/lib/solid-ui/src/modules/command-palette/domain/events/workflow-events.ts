/**
 * Workflow Domain Events
 * Events that occur in the workflow domain
 */

import type { Workflow } from "../../types/integration/workflow";

export type WorkflowEventType =
	| "workflow-created"
	| "workflow-updated"
	| "workflow-deleted"
	| "workflow-executed"
	| "workflow-failed"
	| "workflow-step-executed"
	| "workflow-step-failed";

export interface WorkflowEvent {
	readonly type: WorkflowEventType;
	readonly timestamp: Date;
	readonly workflowId: string;
	readonly data?: unknown;
}

export interface WorkflowCreatedEvent extends WorkflowEvent {
	readonly type: "workflow-created";
	readonly data: {
		readonly workflow: Workflow;
	};
}

export interface WorkflowUpdatedEvent extends WorkflowEvent {
	readonly type: "workflow-updated";
	readonly data: {
		readonly workflow: Workflow;
		readonly changes: Partial<Workflow>;
	};
}

export interface WorkflowDeletedEvent extends WorkflowEvent {
	readonly type: "workflow-deleted";
	readonly data: {
		readonly workflowId: string;
	};
}

export interface WorkflowExecutedEvent extends WorkflowEvent {
	readonly type: "workflow-executed";
	readonly data: {
		readonly executionId: string;
		readonly duration: number;
	};
}

export interface WorkflowFailedEvent extends WorkflowEvent {
	readonly type: "workflow-failed";
	readonly data: {
		readonly executionId: string;
		readonly error: string;
		readonly failedStepId: string;
	};
}

export const createWorkflowCreatedEvent = (workflow: Workflow): WorkflowCreatedEvent => ({
	type: "workflow-created",
	timestamp: new Date(),
	workflowId: workflow.id,
	data: { workflow },
});

export const createWorkflowUpdatedEvent = (workflow: Workflow, changes: Partial<Workflow>): WorkflowUpdatedEvent => ({
	type: "workflow-updated",
	timestamp: new Date(),
	workflowId: workflow.id,
	data: { workflow, changes },
});

export const createWorkflowDeletedEvent = (workflowId: string): WorkflowDeletedEvent => ({
	type: "workflow-deleted",
	timestamp: new Date(),
	workflowId,
	data: { workflowId },
});

export const createWorkflowExecutedEvent = (
	workflowId: string,
	executionId: string,
	duration: number,
): WorkflowExecutedEvent => ({
	type: "workflow-executed",
	timestamp: new Date(),
	workflowId,
	data: { executionId, duration },
});

export const createWorkflowFailedEvent = (
	workflowId: string,
	executionId: string,
	error: string,
	failedStepId: string,
): WorkflowFailedEvent => ({
	type: "workflow-failed",
	timestamp: new Date(),
	workflowId,
	data: { executionId, error, failedStepId },
});
