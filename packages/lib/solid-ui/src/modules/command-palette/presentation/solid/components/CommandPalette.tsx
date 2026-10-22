/**
 * CommandPalette - SolidJS component for command palette
 */

import { For, onCleanup, onMount, Show, splitProps } from "solid-js";
import type { Command } from "../../../types";
import { CommandItem } from "./CommandItem";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { useCommandPalette } from "./useCommandPalette";

interface CommandPaletteProps {
	isOpen: boolean;
	commands: readonly Command[];
	placeholder?: string;
	onClose?: () => void;
	onSelect?: (command: Command) => void;
	onToggleFavorite?: (command: Command) => void;
	isLoading?: boolean;
	error?: string | null;
}

type CommandPaletteState = ReturnType<typeof useCommandPalette>;

export function CommandPalette(props: CommandPaletteProps) {
	const [local] = splitProps(props, [
		"isOpen",
		"commands",
		"placeholder",
		"onClose",
		"onSelect",
		"onToggleFavorite",
		"isLoading",
		"error",
	]);

	const palette = useCommandPalette({
		commands: local.commands,
		onSelect: local.onSelect,
		onClose: local.onClose,
	});

	return (
		<Show when={local.isOpen}>
			<CommandPaletteDialog
				placeholder={local.placeholder}
				isLoading={local.isLoading}
				error={local.error}
				onClose={local.onClose}
				onToggleFavorite={local.onToggleFavorite}
				palette={palette}
			/>
		</Show>
	);
}

interface CommandPaletteDialogProps {
	placeholder?: string;
	isLoading?: boolean;
	error?: string | null;
	onClose?: () => void;
	onToggleFavorite?: (command: Command) => void;
	palette: CommandPaletteState;
}

function CommandPaletteDialog(props: CommandPaletteDialogProps) {
	const handleToggleFavorite = (event: MouseEvent, command: Command) => {
		event.stopPropagation();
		props.onToggleFavorite?.(command);
	};

	const handleOverlayClick = () => {
		props.onClose?.();
	};

	const handlePaletteClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	let paletteRef: HTMLDivElement | undefined;

	// Focus trap temporarily disabled - requires implementation
	onCleanup(() => {
		// Cleanup when needed
	});

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Overlay with presentation role for click handling */}
			<div class="command-palette-overlay" onClick={handleOverlayClick} role="presentation">
				<div
					ref={paletteRef}
					class="command-palette"
					onClick={handlePaletteClick}
					onKeyDown={props.palette.handleKeyDown}
					role="dialog"
					aria-modal="true"
					aria-label="Command palette"
					tabIndex={-1}
				>
					<CommandPaletteInput palette={props.palette} placeholder={props.placeholder} />
					<CommandPaletteList
						palette={props.palette}
						isLoading={props.isLoading}
						error={props.error}
						onToggleFavorite={handleToggleFavorite}
					/>
				</div>
			</div>
		</>
	);
}

interface CommandPaletteInputProps {
	palette: CommandPaletteState;
	placeholder?: string;
}

function CommandPaletteInput(props: CommandPaletteInputProps) {
	const { searchQuery, setSearchQuery, selectedIndex } = props.palette;

	// Focus input when opened
	let inputRef: HTMLInputElement | undefined;

	onMount(() => {
		if (inputRef) {
			inputRef.focus();
		}
	});

	return (
		<input
			ref={inputRef}
			value={searchQuery()}
			onInput={(e) => setSearchQuery(e.currentTarget.value)}
			placeholder={props.placeholder}
			class="command-palette-input"
			autofocus
			role="combobox"
			aria-expanded="true"
			aria-controls="command-list"
			aria-autocomplete="list"
			aria-activedescendant={`command-item-${selectedIndex()}`}
		/>
	);
}

interface CommandPaletteListProps {
	palette: CommandPaletteState;
	isLoading?: boolean;
	error?: string | null;
	onToggleFavorite: (event: MouseEvent, command: Command) => void;
}

function CommandPaletteList(props: CommandPaletteListProps) {
	const { filteredCommands, selectedIndex, searchQuery, emptySuggestions, selectCommand } = props.palette;

	return (
		<div id="command-list" class="command-list" role="listbox">
			<Show when={props.isLoading}>
				<LoadingState />
			</Show>
			<Show when={!props.isLoading && props.error}>
				<ErrorState error={props.error ?? "An error occurred"} />
			</Show>
			<Show when={!props.isLoading && !props.error}>
				<For each={filteredCommands()}>
					{(command, index) => (
						<CommandItem
							command={command}
							index={index()}
							isSelected={index() === selectedIndex()}
							searchQuery={searchQuery()}
							onSelect={selectCommand}
							onToggleFavorite={props.onToggleFavorite}
						/>
					)}
				</For>
				<Show when={filteredCommands().length === 0}>
					<EmptyState suggestions={emptySuggestions()} onSelectCommand={selectCommand} />
				</Show>
			</Show>
		</div>
	);
}
