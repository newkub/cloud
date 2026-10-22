/**
 * Workflow Types - Domain types for workflow automation
 */

import type { Command } from "../command";

// Workflow types
export interface Workflow {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly steps: readonly WorkflowStep[];
	readonly enabled: boolean;
	readonly triggers: readonly WorkflowTrigger[];
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface WorkflowRequest {
	readonly name: string;
	readonly description?: string;
	readonly steps?: readonly WorkflowStep[];
	readonly enabled?: boolean;
	readonly triggers?: readonly WorkflowTrigger[];
}

export interface WorkflowStep {
	readonly id: string;
	readonly commandId: string;
	readonly command?: Command;
	readonly order: number;
	readonly condition?: WorkflowCondition;
	readonly onError?: WorkflowErrorHandling;
	readonly delay?: number; // milliseconds
}

export interface WorkflowTrigger {
	readonly type: "manual" | "command" | "schedule" | "event";
	readonly config: Record<string, unknown>;
}

export interface WorkflowCondition {
	readonly type: "success" | "failure" | "always" | "custom";
	readonly expression?: string;
	readonly evaluator?: (context: Record<string, unknown>) => boolean;
}

export interface WorkflowErrorHandling {
	readonly type: "stop" | "continue" | "retry";
	readonly maxRetries?: number;
	readonly fallbackCommandId?: string;
}

// Workflow execution types
export interface WorkflowExecution {
	readonly id: string;
	readonly workflowId: string;
	readonly status: "pending" | "running" | "completed" | "failed" | "cancelled";
	readonly currentStepIndex: number;
	readonly results: readonly WorkflowStepResult[];
	readonly startedAt: Date;
	readonly completedAt?: Date;
	readonly error?: string;
}

export interface WorkflowStepResult {
	readonly stepId: string;
	readonly success: boolean;
	readonly result?: unknown;
	readonly error?: string;
	readonly executedAt: Date;
	readonly executionTime: number;
}

// Workflow state
export interface WorkflowState {
	readonly workflows: readonly Workflow[];
	readonly executions: readonly WorkflowExecution[];
	readonly lastUpdated: Date;
}
