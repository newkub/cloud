/**
 * Workflow Repository Port - Interface for workflow persistence
 * Defines contract for workflow storage operations
 */

import type { Result } from "../shared/types";
import type { Workflow, WorkflowExecution } from "../types";

export interface WorkflowRepository {
	// CRUD operations
	save(workflow: Workflow): Promise<Result<Workflow>>;
	findById(id: string): Promise<Result<Workflow | null>>;
	findAll(): Promise<Result<readonly Workflow[]>>;
	update(id: string, updates: Partial<Workflow>): Promise<Result<Workflow>>;
	delete(id: string): Promise<Result<void>>;

	// Query operations
	findByEnabled(enabled: boolean): Promise<Result<readonly Workflow[]>>;
	findByTriggerType(triggerType: string): Promise<Result<readonly Workflow[]>>;

	// Execution operations
	saveExecution(execution: WorkflowExecution): Promise<Result<WorkflowExecution>>;
	findExecutionById(id: string): Promise<Result<WorkflowExecution | null>>;
	findExecutionsByWorkflowId(workflowId: string): Promise<Result<readonly WorkflowExecution[]>>;
	deleteExecution(id: string): Promise<Result<void>>;

	// Bulk operations
	saveMany(workflows: readonly Workflow[]): Promise<Result<readonly Workflow[]>>;
	deleteMany(ids: readonly string[]): Promise<Result<void>>;

	// Count operations
	count(): Promise<Result<number>>;
	countEnabled(): Promise<Result<number>>;
	countDisabled(): Promise<Result<number>>;
}
