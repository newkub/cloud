/**
 * Command Palette Execution - Command execution logic
 */

import type { Command } from "../../../types";

export const executeCommand = (command: Command): void => {
	// Execute command action based on type
	if (command.action.type === "url" && typeof command.action.payload === "string") {
		window.open(command.action.payload, "_blank");
	} else if (command.action.type === "function" && typeof command.action.payload === "function") {
		void command.action.payload();
	}
};
