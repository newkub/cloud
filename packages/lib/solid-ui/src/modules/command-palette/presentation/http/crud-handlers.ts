/**
 * CRUD Command Handlers
 */

import { createCommandUseCase } from "../../application";
import type { CommandRepository, EventDispatcher } from "../../ports";
import type { Command } from "../../types";
import type { CreateCommandRequest, HttpResponse } from "./http-types";

export const createCommandHandler =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (request: CreateCommandRequest): Promise<HttpResponse<Command>> => {
		try {
			const createCommandRequest = {
				label: request.label,
				description: request.description,
				icon: request.icon,
				keywords: request.keywords,
				action: request.action,
				category: request.category,
				hotkey: request.hotkey,
			};

			const result = await createCommandUseCase(commandRepository, eventDispatcher)(createCommandRequest);

			if (!result.success) {
				return {
					statusCode: 400,
					error: {
						code: "COMMAND_CREATION_FAILED",
						message: result.error.message,
					},
				};
			}

			return {
				statusCode: 201,
				body: result.data.command,
			};
		} catch (error) {
			return {
				statusCode: 500,
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Internal server error",
					details: error instanceof Error ? error.message : String(error),
				},
			};
		}
	};

export const getCommandHandler =
	(commandRepository: CommandRepository) =>
	async (commandId: string): Promise<HttpResponse<Command>> => {
		try {
			const result = await commandRepository.findById(commandId);

			if (!result.success) {
				return {
					statusCode: 500,
					error: {
						code: "DATABASE_ERROR",
						message: result.error.message,
					},
				};
			}

			if (!result.data) {
				return {
					statusCode: 404,
					error: {
						code: "COMMAND_NOT_FOUND",
						message: `Command with ID ${commandId} not found`,
					},
				};
			}

			return {
				statusCode: 200,
				body: result.data,
			};
		} catch (error) {
			return {
				statusCode: 500,
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Internal server error",
					details: error instanceof Error ? error.message : String(error),
				},
			};
		}
	};

export const updateCommandHandler =
	(commandRepository: CommandRepository) =>
	async (commandId: string, request: Partial<CreateCommandRequest>): Promise<HttpResponse<Command>> => {
		try {
			// First check if command exists
			const existingResult = await commandRepository.findById(commandId);
			if (!existingResult.success) {
				return {
					statusCode: 500,
					error: {
						code: "DATABASE_ERROR",
						message: existingResult.error.message,
					},
				};
			}

			if (!existingResult.data) {
				return {
					statusCode: 404,
					error: {
						code: "COMMAND_NOT_FOUND",
						message: `Command with ID ${commandId} not found`,
					},
				};
			}

			// Update command
			const updateResult = await commandRepository.update(commandId, {
				label: request.label,
				description: request.description,
				icon: request.icon,
				keywords: request.keywords,
				action: request.action,
				category: request.category,
				hotkey: request.hotkey,
			});

			if (!updateResult.success) {
				return {
					statusCode: 400,
					error: {
						code: "COMMAND_UPDATE_FAILED",
						message: updateResult.error.message,
					},
				};
			}

			return {
				statusCode: 200,
				body: updateResult.data,
			};
		} catch (error) {
			return {
				statusCode: 500,
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Internal server error",
					details: error instanceof Error ? error.message : String(error),
				},
			};
		}
	};

export const deleteCommandHandler =
	(commandRepository: CommandRepository) =>
	async (commandId: string): Promise<HttpResponse<void>> => {
		try {
			// First check if command exists
			const existingResult = await commandRepository.findById(commandId);
			if (!existingResult.success) {
				return {
					statusCode: 500,
					error: {
						code: "DATABASE_ERROR",
						message: existingResult.error.message,
					},
				};
			}

			if (!existingResult.data) {
				return {
					statusCode: 404,
					error: {
						code: "COMMAND_NOT_FOUND",
						message: `Command with ID ${commandId} not found`,
					},
				};
			}

			// Delete command
			const deleteResult = await commandRepository.delete(commandId);
			if (!deleteResult.success) {
				return {
					statusCode: 500,
					error: {
						code: "COMMAND_DELETION_FAILED",
						message: deleteResult.error.message,
					},
				};
			}

			return {
				statusCode: 204,
			};
		} catch (error) {
			return {
				statusCode: 500,
				error: {
					code: "INTERNAL_SERVER_ERROR",
					message: "Internal server error",
					details: error instanceof Error ? error.message : String(error),
				},
			};
		}
	};
