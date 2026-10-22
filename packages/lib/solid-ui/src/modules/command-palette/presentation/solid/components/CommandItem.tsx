/**
 * CommandItem - Individual command item component
 */

import { Show } from "solid-js";
import type { Command } from "../../../types";
import { HighlightText } from "./HighlightText";

interface CommandItemProps {
	command: Command;
	index: number;
	isSelected: boolean;
	searchQuery: string;
	onSelect: (command: Command) => void;
	onToggleFavorite: (event: MouseEvent, command: Command) => void;
}

export function CommandItem(props: CommandItemProps) {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			props.onSelect(props.command);
		}
	};

	return (
		<div
			id={`command-item-${props.index}`}
			class={`command-item ${props.isSelected ? "selected" : ""}`}
			onClick={() => props.onSelect(props.command)}
			onKeyDown={handleKeyDown}
			role="option"
			aria-selected={props.isSelected}
			tabIndex={props.isSelected ? 0 : -1}
		>
			<div class="command-content">
				<div class="command-text">
					<div class="command-label">
						<HighlightText text={props.command.label} query={props.searchQuery} />
					</div>
					<Show when={props.command.description}>
						<div class="command-description">
							<HighlightText text={props.command.description ?? ""} query={props.searchQuery} />
						</div>
					</Show>
				</div>
				<div class="command-actions">
					<Show when={props.command.hotkey}>
						<div class="command-hotkey">
							<kbd>{props.command.hotkey}</kbd>
						</div>
					</Show>
					<button
						class="command-favorite-button"
						onClick={(e) => props.onToggleFavorite(e, props.command)}
						type="button"
						aria-label={props.command.isFavorite ? "Remove from favorites" : "Add to favorites"}
					>
						{props.command.isFavorite ? "★" : "☆"}
					</button>
				</div>
			</div>
		</div>
	);
}
