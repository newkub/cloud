/**
 * Command Palette Workflows
 * Complex multi-step workflows for command palette operations
 */

import type { Command } from "../../types";

// Workflow for searching and filtering commands
export const searchCommandsWorkflow = async (
	commands: Command[],
	query: string,
	options?: { fuzzy?: boolean; limit?: number },
): Promise<Command[]> => {
	if (!query.trim()) {
		return commands.slice(0, options?.limit || 10);
	}

	const searchTerm = query.toLowerCase();
	const results: Command[] = [];

	for (const command of commands) {
		const labelMatch = command.label.toLowerCase().includes(searchTerm);
		const descriptionMatch = command.description?.toLowerCase().includes(searchTerm);
		const keywordsMatch = command.keywords?.some((keyword: string) => keyword.toLowerCase().includes(searchTerm));

		if (labelMatch || descriptionMatch || keywordsMatch) {
			results.push(command);
		}

		if (options?.limit && results.length >= options.limit) {
			break;
		}
	}

	return results;
};

// Workflow for executing a command with validation
export const executeCommandWorkflow = async (
	command: Command,
	_context?: Record<string, unknown>,
): Promise<{ success: boolean; result?: unknown; error?: string }> => {
	try {
		// Execute command based on action type
		if (command.action.type === "url" && typeof command.action.payload === "string") {
			window.open(command.action.payload, "_blank");
			return { success: true, result: "URL opened" };
		} else if (command.action.type === "function" && typeof command.action.payload === "function") {
			const result = await command.action.payload();
			return { success: true, result };
		} else if (command.action.type === "plugin") {
			// Plugin execution would be handled by plugin manager
			return { success: false, error: "Plugin execution not implemented" };
		} else if (command.action.type === "system") {
			// System command execution
			return {
				success: false,
				error: "System command execution not implemented",
			};
		}

		return {
			success: false,
			error: `Command ${command.id} has unsupported action type`,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Command execution failed",
		};
	}
};

// Workflow for getting recently used commands
export const getRecentCommandsWorkflow = async (commands: Command[], maxCount: number = 5): Promise<Command[]> => {
	try {
		// Fetch recent command IDs from localStorage
		const recentIds = localStorage.getItem("recentCommands");
		if (!recentIds) {
			return commands.slice(0, maxCount);
		}

		const ids = JSON.parse(recentIds) as string[];
		const recentCommands: Command[] = [];

		for (const id of ids) {
			const command = commands.find((cmd) => cmd.id === id);
			if (command) {
				recentCommands.push(command);
			}
			if (recentCommands.length >= maxCount) {
				break;
			}
		}

		return recentCommands;
	} catch {
		// Fallback to first maxCount commands if localStorage fails
		return commands.slice(0, maxCount);
	}
};

// Workflow for saving a recently used command
export const saveRecentCommandWorkflow = async (commandId: string): Promise<void> => {
	try {
		const recentIds = localStorage.getItem("recentCommands");
		const ids = recentIds ? (JSON.parse(recentIds) as string[]) : [];

		// Remove if already exists
		const index = ids.indexOf(commandId);
		if (index > -1) {
			ids.splice(index, 1);
		}

		// Add to front
		ids.unshift(commandId);

		// Keep only last 20
		if (ids.length > 20) {
			ids.pop();
		}

		localStorage.setItem("recentCommands", JSON.stringify(ids));
	} catch {
		// Silently fail if localStorage is not available
	}
};
