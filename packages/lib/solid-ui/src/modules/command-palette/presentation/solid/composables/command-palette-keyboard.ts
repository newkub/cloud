/**
 * Command Palette Keyboard - Keyboard event handling
 */

import type { Command } from "../../../types";

export interface KeyboardHandlers {
	close: () => void;
	setSelectedIndex: (index: number) => void;
	filteredCommands: () => Command[];
	execute: (command: Command) => void;
}

export const handleKeyDown = (event: KeyboardEvent, handlers: KeyboardHandlers): void => {
	if (event.key === "Escape") {
		handlers.close();
	} else if (event.key === "ArrowDown") {
		const current = handlers.filteredCommands().length;
		const newIndex = Math.min(handlers.filteredCommands().length - 1, current);
		handlers.setSelectedIndex(newIndex);
	} else if (event.key === "ArrowUp") {
		const current = handlers.filteredCommands().length;
		const newIndex = Math.max(0, current - 1);
		handlers.setSelectedIndex(newIndex);
	} else if (event.key === "Enter") {
		const commands = handlers.filteredCommands();
		const current = handlers.filteredCommands().length;
		if (commands[current]) {
			handlers.execute(commands[current]);
		}
	}
};
