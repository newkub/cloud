/**
 * Navigation Operations - Domain operations for multi-level navigation
 * Pure functions for managing command navigation state
 */

import type { Command } from "../../types";

export interface NavigationState {
	readonly currentPath: readonly string[];
	readonly currentCommands: readonly Command[];
	readonly parentCommand: Command | null;
}

/**
 * Create initial navigation state
 */
export const createInitialNavigationState = (commands: readonly Command[]): NavigationState => ({
	currentPath: [],
	currentCommands: commands,
	parentCommand: null,
});

/**
 * Navigate to subcommands
 */
export const navigateToSubcommands = (state: NavigationState, command: Command): NavigationState => {
	if (!command.subcommands || command.subcommands.length === 0) {
		return state;
	}

	return {
		currentPath: [...state.currentPath, command.id],
		currentCommands: command.subcommands,
		parentCommand: command,
	};
};

/**
 * Navigate back to parent
 */
export const navigateToParent = (state: NavigationState, commands: readonly Command[]): NavigationState => {
	if (state.currentPath.length === 0) {
		return state;
	}

	// Find parent command
	const parentPath = state.currentPath.slice(0, -1);
	const parentCommandId = parentPath[parentPath.length - 1];

	if (parentPath.length === 0) {
		// Return to root
		return createInitialNavigationState(commands);
	}

	// Find parent command in original commands
	const findCommandById = (cmds: readonly Command[], id: string): Command | null => {
		for (const cmd of cmds) {
			if (cmd.id === id) return cmd;
			if (cmd.subcommands) {
				const found = findCommandById(cmd.subcommands, id);
				if (found) return found;
			}
		}
		return null;
	};

	const parentCommand = parentCommandId ? findCommandById(commands, parentCommandId) : null;

	if (!parentCommand) {
		return createInitialNavigationState(commands);
	}

	return {
		currentPath: parentPath,
		currentCommands: parentCommand.subcommands || [],
		parentCommand: null,
	};
};

/**
 * Navigate to root
 */
export const navigateToRoot = (commands: readonly Command[]): NavigationState => createInitialNavigationState(commands);

/**
 * Check if navigation is at root
 */
export const isAtRoot = (state: NavigationState): boolean => state.currentPath.length === 0;

/**
 * Check if command has subcommands
 */
export const hasSubcommands = (command: Command): boolean =>
	Boolean(command.subcommands && command.subcommands.length > 0);

/**
 * Get breadcrumb items from navigation state
 */
export const getBreadcrumbs = (state: NavigationState, commands: readonly Command[]): readonly Command[] => {
	const breadcrumbs: Command[] = [];

	const findCommandById = (cmds: readonly Command[], id: string): Command | null => {
		for (const cmd of cmds) {
			if (cmd.id === id) return cmd;
			if (cmd.subcommands) {
				const found = findCommandById(cmd.subcommands, id);
				if (found) return found;
			}
		}
		return null;
	};

	for (const pathId of state.currentPath) {
		const command = findCommandById(commands, pathId);
		if (command) {
			breadcrumbs.push(command);
		}
	}

	return breadcrumbs;
};
