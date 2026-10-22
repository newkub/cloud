/**
 * useCommandPalette - Custom hook for command palette logic
 */

import { createEffect, createMemo, createSignal, type Setter } from "solid-js";
import { getCommandsSortedByFavorites, getEmptyStateSuggestions } from "../../../domain/operations";
import type { Command } from "../../../types";

interface UseCommandPaletteProps {
	commands: readonly Command[];
	onSelect?: (command: Command) => void;
	onClose?: () => void;
}

function getFilteredCommands(commands: readonly Command[], query: string): readonly Command[] {
	if (!query) {
		return getCommandsSortedByFavorites(commands);
	}

	const lowerQuery = query.toLowerCase();
	return commands.filter((cmd) => {
		const label = cmd.label?.toLowerCase() || "";
		const description = cmd.description?.toLowerCase() || "";
		const keywords = cmd.keywords?.map((k) => k.toLowerCase()) || [];
		const aliases = cmd.aliases?.map((a) => a.toLowerCase()) || [];

		return (
			label.includes(lowerQuery) ||
			description.includes(lowerQuery) ||
			keywords.some((k) => k.includes(lowerQuery)) ||
			aliases.some((a) => a.includes(lowerQuery))
		);
	});
}

function createKeyDownHandler(
	filteredCommands: () => readonly Command[],
	selectedIndex: () => number,
	setSelectedIndex: Setter<number>,
	onSelect: (command: Command) => void,
	onClose: (() => void) | undefined,
) {
	return (event: KeyboardEvent) => {
		switch (event.key) {
			case "ArrowDown":
				setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands().length - 1));
				event.preventDefault();
				break;
			case "ArrowUp":
				setSelectedIndex((prev) => Math.max(prev - 1, 0));
				event.preventDefault();
				break;
			case "Enter": {
				const selectedCmd = filteredCommands()[selectedIndex()];
				if (selectedCmd) {
					onSelect(selectedCmd);
				}
				break;
			}
			case "Escape":
				onClose?.();
				break;
		}
	};
}

export function useCommandPalette(props: UseCommandPaletteProps) {
	const [searchQuery, setSearchQuery] = createSignal("");
	const [selectedIndex, setSelectedIndex] = createSignal(0);

	const filteredCommands = createMemo(() => getFilteredCommands(props.commands, searchQuery()));

	const emptySuggestions = createMemo(() => {
		if (filteredCommands().length === 0) {
			return getEmptyStateSuggestions(props.commands, {
				timestamp: new Date(),
			});
		}
		return [];
	});

	const handleKeyDown = createKeyDownHandler(
		filteredCommands,
		selectedIndex,
		setSelectedIndex,
		(command: Command) => props.onSelect?.(command),
		props.onClose,
	);

	const selectCommand = (command: Command) => {
		props.onSelect?.(command);
	};

	// Reset selection when filtered commands change
	createEffect(() => {
		setSelectedIndex(0);
	});

	return {
		searchQuery,
		setSearchQuery,
		selectedIndex,
		filteredCommands,
		emptySuggestions,
		handleKeyDown,
		selectCommand,
	};
}
