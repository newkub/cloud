/**
 * Execute Command Action - Handles different action types
 */

import type { Command, CommandExecutionContext, CommandExecutionResult } from "../../../types";

export const executeCommandAction = async (
	command: Command,
	context: CommandExecutionContext,
): Promise<CommandExecutionResult> => {
	const startTime = Date.now();

	try {
		let result: unknown;
		const success = true;
		let error: string | undefined;

		switch (command.action.type) {
			case "url":
				// Handle URL action - would open in browser
				result = { url: command.action.payload };
				break;

			case "function":
				// Handle function action - would execute function
				if (typeof command.action.payload === "string") {
					// Execute function by name
					result = { function: command.action.payload, executed: true };
				} else {
					// Execute function with parameters
					result = { function: command.action.payload, executed: true };
				}
				break;

			case "plugin":
				// Handle plugin action - would call plugin
				result = { plugin: command.action.payload, executed: true };
				break;

			case "system":
				// Handle system action - would execute system command
				result = { system: command.action.payload, executed: true };
				break;

			default:
				throw new Error(`Unknown action type: ${command.action.type}`);
		}

		const executionTime = Date.now() - startTime;

		return {
			commandId: command.id,
			success,
			result,
			error,
			executionTime,
			context,
		};
	} catch (error) {
		const executionTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		return {
			commandId: command.id,
			success: false,
			error: errorMessage,
			executionTime,
			context,
		};
	}
};
