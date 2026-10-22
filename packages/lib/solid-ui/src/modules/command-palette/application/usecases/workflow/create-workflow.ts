/**
 * Create Workflow Use Case - Application orchestration
 * Handles workflow creation workflow with validation and persistence
 */

import type { CommandEvent } from "../../../domain/events/command-events";
import { createWorkflowDeletedEvent } from "../../../domain/events/workflow-events";
import { validateWorkflow } from "../../../domain/operations/workflow";
import type { EventDispatcher, WorkflowRepository } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { Workflow, WorkflowRequest } from "../../../types";

export type CreateWorkflowRequest = WorkflowRequest;

export interface CreateWorkflowResponse {
	readonly workflow: Workflow;
	readonly success: boolean;
}

export const createWorkflowUseCase =
	(workflowRepository: WorkflowRepository, _eventDispatcher: EventDispatcher) =>
	async (request: CreateWorkflowRequest): Promise<Result<CreateWorkflowResponse>> => {
		try {
			// Step 1: Create workflow domain object
			const workflow: Workflow = {
				id: crypto.randomUUID(),
				name: request.name,
				steps: request.steps ?? [],
				triggers: request.triggers ?? [],
				enabled: request.enabled ?? true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Step 2: Validate workflow
			const validationResult = validateWorkflow(workflow);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("workflow", validationResult.error.message),
				};
			}

			// Step 3: Check if workflow already exists
			const existingWorkflowResult = await workflowRepository.findById(workflow.id);
			if (!existingWorkflowResult.success) {
				return {
					success: false,
					error: UseCaseError("createWorkflow", "Failed to check existing workflow", existingWorkflowResult.error),
				};
			}

			if (existingWorkflowResult.data) {
				return {
					success: false,
					error: new Error(`Workflow already exists: ${workflow.id}`),
				};
			}

			// Step 4: Save workflow
			const saveResult = await workflowRepository.save(workflow);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("createWorkflow", "Failed to save workflow", saveResult.error),
				};
			}

			// Step 5: Dispatch event (commented out - workflow events need separate dispatcher)\r\n// const event = createWorkflowCreatedEvent(saveResult.data);\r\n// const dispatchResult = await eventDispatcher.dispatch(event);\r\n// if (!dispatchResult.success) {\r\n// 	// Event dispatch failed - continue with response\r\n// }

			// Step 6: Return success response
			return {
				success: true,
				data: {
					workflow: saveResult.data,
					success: true,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"createWorkflow",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const updateWorkflowUseCase =
	(workflowRepository: WorkflowRepository, _eventDispatcher: EventDispatcher) =>
	async (workflowId: string, updates: Partial<Workflow>): Promise<Result<CreateWorkflowResponse>> => {
		try {
			// Step 1: Get existing workflow
			const existingResult = await workflowRepository.findById(workflowId);
			if (!existingResult.success) {
				return {
					success: false,
					error: UseCaseError("updateWorkflow", "Failed to get existing workflow", existingResult.error),
				};
			}

			if (!existingResult.data) {
				return {
					success: false,
					error: new Error(`Workflow not found: ${workflowId}`),
				};
			}

			// Step 2: Update workflow
			const updatedWorkflow: Workflow = {
				...existingResult.data,
				...updates,
				updatedAt: new Date(),
			};

			// Step 3: Validate updated workflow
			const validationResult = validateWorkflow(updatedWorkflow);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("workflow", validationResult.error.message),
				};
			}

			// Step 4: Save updated workflow
			const saveResult = await workflowRepository.save(updatedWorkflow);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("updateWorkflow", "Failed to save workflow", saveResult.error),
				};
			}

			// Step 5: Dispatch event (commented out - workflow events need separate dispatcher)\r\n// const event = createWorkflowCreatedEvent(saveResult.data);\r\n// const dispatchResult = await eventDispatcher.dispatch(event);\r\n// if (!dispatchResult.success) {\r\n// 	// Event dispatch failed - continue with response\r\n// }

			return {
				success: true,
				data: {
					workflow: saveResult.data,
					success: true,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"updateWorkflow",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const deleteWorkflowUseCase =
	(workflowRepository: WorkflowRepository, _eventDispatcher: EventDispatcher) =>
	async (workflowId: string): Promise<Result<{ success: boolean }>> => {
		try {
			// Step 1: Delete workflow
			const deleteResult = await workflowRepository.delete(workflowId);
			if (!deleteResult.success) {
				return {
					success: false,
					error: UseCaseError("deleteWorkflow", "Failed to delete workflow", deleteResult.error),
				};
			}

			// Step 2: Dispatch event
			const event = createWorkflowDeletedEvent(workflowId);
			const dispatchResult = await _eventDispatcher.dispatch(event as unknown as CommandEvent);
			if (!dispatchResult.success) {
				// Event dispatch failed - continue with response
			}

			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"deleteWorkflow",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
