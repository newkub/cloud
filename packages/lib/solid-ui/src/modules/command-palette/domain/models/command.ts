/**
 * Command Model - Pure domain model for commands
 * Immutable data structure with no side effects
 */

import type { Result } from "../../shared/types";
import type { Command, CommandAction, CommandRequest } from "../../types";

// Command factory function
export const createCommand = (request: CommandRequest): Result<Command> => {
	const now = new Date();

	const command: Command = {
		id: generateCommandId(request.label),
		label: request.label,
		description: request.description,
		icon: request.icon,
		keywords: request.keywords || [],
		action: request.action,
		category: request.category,
		hotkey: request.hotkey,
		enabled: true,
		createdAt: now,
		updatedAt: now,
	};

	return { success: true, data: command };
};

// Command update function
export const updateCommand = (command: Command, updates: Partial<CommandRequest>): Result<Command> => {
	const updatedCommand: Command = {
		...command,
		...updates,
		updatedAt: new Date(),
	};

	return { success: true, data: updatedCommand };
};

// Command validation
export const validateCommand = (command: Command): Result<Command> => {
	if (!command.id || command.id.trim().length === 0) {
		return { success: false, error: new Error("Command ID is required") };
	}

	if (!command.label || command.label.trim().length === 0) {
		return { success: false, error: new Error("Command label is required") };
	}

	if (command.label.length > 100) {
		return {
			success: false,
			error: new Error("Command label must be 100 characters or less"),
		};
	}

	if (!isValidCommandAction(command.action)) {
		return { success: false, error: new Error("Invalid command action") };
	}

	return { success: true, data: command };
};

// Command state operations
export const enableCommand = (command: Command): Command => ({
	...command,
	enabled: true,
	updatedAt: new Date(),
});

export const disableCommand = (command: Command): Command => ({
	...command,
	enabled: false,
	updatedAt: new Date(),
});

export const toggleCommand = (command: Command): Command => ({
	...command,
	enabled: !command.enabled,
	updatedAt: new Date(),
});

// Command queries
export const isCommandEnabled = (command: Command): boolean => command.enabled;

export const isCommandInCategory = (command: Command, category: string): boolean => command.category === category;

export const commandMatchesQuery = (command: Command, query: string): boolean => {
	const lowerQuery = query.toLowerCase();

	// Check label match
	if (command.label.toLowerCase().includes(lowerQuery)) {
		return true;
	}

	// Check description match
	if (command.description?.toLowerCase().includes(lowerQuery)) {
		return true;
	}

	// Check keywords match
	if (command.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery))) {
		return true;
	}

	return false;
};

export const commandMatchesCategory = (command: Command, category?: string): boolean =>
	!category || command.category === category;

export const commandHasHotkey = (command: Command): boolean =>
	Boolean(command.hotkey && command.hotkey.trim().length > 0);

// Command sorting
export const compareCommandsByLabel = (a: Command, b: Command): number => a.label.localeCompare(b.label);

export const compareCommandsByCreatedAt = (a: Command, b: Command): number =>
	b.createdAt.getTime() - a.createdAt.getTime();

export const compareCommandsByUpdatedAt = (a: Command, b: Command): number =>
	b.updatedAt.getTime() - a.updatedAt.getTime();

// Helper functions
const generateCommandId = (label: string): string => {
	const timestamp = Date.now();
	const normalizedLabel = label
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	return `${normalizedLabel}-${timestamp}`;
};

const isValidCommandAction = (action: CommandAction): boolean => {
	const validTypes = ["url", "function", "plugin", "system"] as const;
	return validTypes.includes(action.type);
};
