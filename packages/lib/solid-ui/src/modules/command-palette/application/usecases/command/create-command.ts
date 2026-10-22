/**
 * Create Command Use Case - Application orchestration
 * Handles command creation workflow with validation and persistence
 */

import { createCommandCreatedEvent } from "../../../domain/events/command-events";
// Domain imports
import { createCommand as createCommandDomain, validateCommand } from "../../../domain/models/command";
import { validateCommandRequest } from "../../../domain/operations/validation";
import type { CommandRepository, EventDispatcher } from "../../../ports";
// Application errors
import { CommandAlreadyExistsError, UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { Command, CommandRequest } from "../../../types";

export type CreateCommandRequest = CommandRequest;

export interface CreateCommandResponse {
	readonly command: Command;
	readonly success: boolean;
}

export const createCommandUseCase =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (request: CreateCommandRequest): Promise<Result<CreateCommandResponse>> => {
		try {
			// Step 1: Validate request
			const validationResult = validateCommandRequest(request);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("request", validationResult.error.message),
				};
			}

			// Step 2: Create command domain object
			const createResult = createCommandDomain(validationResult.data);
			if (!createResult.success) {
				return {
					success: false,
					error: ValidationError("command", createResult.error.message),
				};
			}

			const command = createResult.data;

			// Step 3: Validate command
			const domainValidationResult = validateCommand(command);
			if (!domainValidationResult.success) {
				return {
					success: false,
					error: ValidationError("domain", domainValidationResult.error.message),
				};
			}

			// Step 4: Check if command already exists
			const existingCommandResult = await commandRepository.findById(command.id);
			if (!existingCommandResult.success) {
				return {
					success: false,
					error: UseCaseError("createCommand", "Failed to check existing command", existingCommandResult.error),
				};
			}

			if (existingCommandResult.data) {
				return {
					success: false,
					error: CommandAlreadyExistsError(command.id),
				};
			}

			// Step 5: Save command
			const saveResult = await commandRepository.save(command);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("createCommand", "Failed to save command", saveResult.error),
				};
			}

			// Step 6: Dispatch event
			const event = createCommandCreatedEvent(saveResult.data);
			const dispatchResult = await eventDispatcher.dispatch(event);
			if (!dispatchResult.success) {
				// Event dispatch failed - continue with response
			}

			// Step 7: Return success response
			return {
				success: true,
				data: {
					command: saveResult.data,
					success: true,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"createCommand",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

// Batch create command use case
export const createCommandsUseCase =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (requests: readonly CreateCommandRequest[]): Promise<Result<readonly CreateCommandResponse[]>> => {
		try {
			const results: CreateCommandResponse[] = [];
			const errors: Error[] = [];

			for (const request of requests) {
				const result = await createCommandUseCase(commandRepository, eventDispatcher)(request);

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
						"createCommands",
						`All commands failed to create. Errors: ${errors.map((e) => e.message).join(", ")}`,
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
					"createCommands",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
