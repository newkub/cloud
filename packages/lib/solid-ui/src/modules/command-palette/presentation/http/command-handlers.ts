/**
 * Command HTTP Handlers - HTTP API endpoints
 * REST API handlers for command palette operations
 */

// Application imports
import { executeCommandUseCase, searchCommandsUseCase } from "../../application";
import type { CommandRepository, EventDispatcher } from "../../ports";
import type { Command, CommandSearchQuery } from "../../types";

// Re-export CRUD handlers
export {
	createCommandHandler,
	deleteCommandHandler,
	getCommandHandler,
	updateCommandHandler,
} from "./crud-handlers";
// Re-export types
export type {
	CreateCommandRequest,
	ExecuteCommandRequest,
	HttpResponse,
	SearchCommandsRequest,
} from "./http-types";

// Import types for use
import type { ExecuteCommandRequest, HttpResponse, SearchCommandsRequest } from "./http-types";

// HTTP Handler factory
export const createCommandHandlers = (commandRepository: CommandRepository, eventDispatcher: EventDispatcher) => ({
	// GET /commands - Search commands
	searchCommands: async (
		request: SearchCommandsRequest,
	): Promise<HttpResponse<{ commands: readonly Command[]; total: number }>> => {
		try {
			const searchQuery: CommandSearchQuery = {
				query: request.query ?? "",
				category: request.category,
				enabled: request.enabled,
				limit: request.limit,
				offset: request.offset,
			};

			const result = await searchCommandsUseCase(commandRepository, eventDispatcher)(searchQuery);

			if (!result.success) {
				return {
					statusCode: 400,
					error: {
						code: "SEARCH_FAILED",
						message: result.error.message,
					},
				};
			}

			return {
				statusCode: 200,
				body: {
					commands: result.data.commands,
					total: result.data.totalCount,
				},
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
	},

	// POST /commands/:id/execute - Execute command
	executeCommand: async (
		commandId: string,
		request: ExecuteCommandRequest,
	): Promise<HttpResponse<{ success: boolean; result?: unknown; executionTime: number }>> => {
		try {
			const executeRequest = {
				commandId,
				context: request.context,
			};

			const result = await executeCommandUseCase(commandRepository, eventDispatcher)(executeRequest);

			if (!result.success) {
				return {
					statusCode: 400,
					error: {
						code: "COMMAND_EXECUTION_FAILED",
						message: result.error.message,
					},
				};
			}

			return {
				statusCode: 200,
				body: {
					success: result.data.result.success,
					result: result.data.result.result,
					executionTime: result.data.result.executionTime,
				},
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
	},

	// GET /commands/categories - Get all categories
	getCategories: async (): Promise<HttpResponse<readonly string[]>> => {
		try {
			const result = await commandRepository.getAllCategories();

			if (!result.success) {
				return {
					statusCode: 500,
					error: {
						code: "DATABASE_ERROR",
						message: result.error.message,
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
	},
});
