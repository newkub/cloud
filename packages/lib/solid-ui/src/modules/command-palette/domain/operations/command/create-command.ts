/**
 * Create Command - Single responsibility for command creation
 * Pure function for creating command domain objects
 */

import type { Result } from "../../../shared/types";
import type { Command, CommandRequest } from "../../../types";

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

// Helper function to generate command ID
const generateCommandId = (label: string): string => {
	const timestamp = Date.now();
	const normalizedLabel = label
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "_");

	return `${normalizedLabel}_${timestamp}`;
};
