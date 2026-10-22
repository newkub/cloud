/**
 * EmptyState - Empty state component for command palette
 */

import { For, Show } from "solid-js";
import type { Suggestion } from "../../../domain/operations";
import type { Command } from "../../../types";

interface EmptyStateProps {
	suggestions: readonly Suggestion[];
	onSelectCommand: (command: Command) => void;
}

export function EmptyState(props: EmptyStateProps) {
	return (
		<div class="command-empty" role="status" aria-live="polite">
			<Show when={props.suggestions.length > 0}>
				<div class="empty-suggestions">
					<p class="empty-title">Try these commands:</p>
					<For each={props.suggestions}>
						{(suggestion) => {
							const handleKeyDown = (event: KeyboardEvent) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									props.onSelectCommand(suggestion.command);
								}
							};
							return (
								<button
									type="button"
									class="empty-suggestion-item"
									onClick={() => props.onSelectCommand(suggestion.command)}
									onKeyDown={handleKeyDown}
								>
									<span class="suggestion-label">{suggestion.command.label}</span>
									<span class="suggestion-reason">{suggestion.reason}</span>
								</button>
							);
						}}
					</For>
				</div>
			</Show>
			<Show when={props.suggestions.length === 0}>
				<p>No commands found</p>
			</Show>
		</div>
	);
}
