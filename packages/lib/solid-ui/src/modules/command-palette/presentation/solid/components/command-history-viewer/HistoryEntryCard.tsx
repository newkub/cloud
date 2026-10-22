/**
 * HistoryEntryCard - Individual history entry component
 */

import { Show, splitProps } from "solid-js";
import type { Command, CommandHistoryEntry } from "../../../../types";

interface HistoryEntryCardProps {
	entry: CommandHistoryEntry;
	command?: Command;
	formatExecutionTime: (ms: number) => string;
	formatDate: (date: Date) => string;
	onReplay: (entry: CommandHistoryEntry) => void;
}

export function HistoryEntryCard(props: HistoryEntryCardProps) {
	const [local] = splitProps(props, ["entry", "command", "formatExecutionTime", "formatDate", "onReplay"]);

	return (
		<div class={`history-entry-card ${local.entry.success ? "success" : "failed"}`}>
			<div class="entry-header">
				<div class="entry-info">
					<span class={`status-indicator ${local.entry.success ? "success" : "failed"}`}>
						{local.entry.success ? "✓" : "✗"}
					</span>
					<span class="entry-command">{local.command?.label ?? local.entry.commandId}</span>
					<Show when={local.command?.category}>
						<span class="entry-category">{local.command?.category}</span>
					</Show>
				</div>
				<div class="entry-actions">
					<button
						class="action-button replay"
						onClick={() => local.onReplay(local.entry)}
						type="button"
						title="Replay command"
					>
						Replay
					</button>
				</div>
			</div>

			<div class="entry-meta">
				<span class="meta-item">{local.formatDate(local.entry.executedAt)}</span>
				<span class="meta-item">{local.formatExecutionTime(local.entry.executionTime)}</span>
			</div>

			<Show when={local.entry.error}>
				<div class="entry-error">
					<span class="error-label">Error:</span>
					<span class="error-message">{local.entry.error}</span>
				</div>
			</Show>

			<Show when={local.entry.result}>
				<div class="entry-result">
					<span class="result-label">Result:</span>
					<span class="result-value">
						{typeof local.entry.result === "object" ? JSON.stringify(local.entry.result) : String(local.entry.result)}
					</span>
				</div>
			</Show>
		</div>
	);
}
