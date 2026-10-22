/**
 * Execute Command Use Case - Application orchestration
 * Handles command execution workflow with validation and tracking
 */

// Domain imports
import { createCommandExecutedEvent } from "../../../domain/events/command-events";
import type { CommandRepository, EventDispatcher } from "../../../ports";
// Application errors
import { CommandNotFoundError, UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { CommandExecutionContext } from "../../../types";
import { updateCommandExecutionStats } from "../history/update-command-stats";
import { executeCommandAction } from "./execute-command-action";
import type { ExecuteCommandRequest, ExecuteCommandResponse } from "./execute-command-types";
// Helper functions
import { validateExecuteCommandRequest } from "./validate-command-request";

export const executeCommandUseCase =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (request: ExecuteCommandRequest): Promise<Result<ExecuteCommandResponse>> => {
		// const _startTime = Date.now();

		try {
			// Step 1: Validate request
			const validationResult = validateExecuteCommandRequest(request);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("request", validationResult.error.message),
				};
			}

			// Step 2: Find command
			const commandResult = await commandRepository.findById(request.commandId);
			if (!commandResult.success) {
				return {
					success: false,
					error: UseCaseError("executeCommand", "Failed to find command", commandResult.error),
				};
			}

			const command = commandResult.data;
			if (!command) {
				return {
					success: false,
					error: CommandNotFoundError(request.commandId),
				};
			}

			// Step 3: Check if command is enabled
			if (!command.enabled) {
				return {
					success: false,
					error: new Error(`Command ${request.commandId} is disabled`),
				};
			}

			// Step 4: Create execution context
			const context: CommandExecutionContext = {
				timestamp: new Date(),
				userId: request.context?.userId,
				sessionId: request.context?.sessionId,
				metadata: request.context?.metadata || [],
			};

			// Step 5: Execute command
			const executionResult = await executeCommandAction(command, context);

			// Step 6: Update command if needed (e.g., execution count)
			const updateResult = await updateCommandExecutionStats(commandRepository, command.id);
			if (!updateResult.success) {
				// Stats update failed - continue with execution
			}

			// Step 7: Dispatch event
			const event = createCommandExecutedEvent(command.id, executionResult);
			const dispatchResult = await eventDispatcher.dispatch(event);
			if (!dispatchResult.success) {
				// Event dispatch failed - continue with response
			}

			// Step 8: Return success response
			return {
				success: true,
				data: {
					command,
					result: executionResult,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"executeCommand",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

// Execute multiple commands use case
export const executeCommandsUseCase =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (requests: readonly ExecuteCommandRequest[]): Promise<Result<readonly ExecuteCommandResponse[]>> => {
		try {
			const results: ExecuteCommandResponse[] = [];
			const errors: Error[] = [];

			for (const request of requests) {
				const result = await executeCommandUseCase(commandRepository, eventDispatcher)(request);

				if (result.success) {
					results.push(result.data);
				} else {
					errors.push(result.error);
				}
			}

			if (errors.length > 0 && results.length === 0) {
				return {
					success: false,
					error: UseCaseError(
						"executeCommands",
						`All commands failed to execute. Errors: ${errors.map((e) => e.message).join(", ")}`,
					),
				};
			}

			if (errors.length > 0) {
				// Some commands failed - continue with successful ones
			}

			return { success: true, data: results };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"executeCommands",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
