/**
 * CommandHistoryViewer - SolidJS component for viewing command execution history
 */

import { type Accessor, createMemo, createSignal, For, Show, splitProps } from "solid-js";
import type { Command, CommandHistoryEntry } from "../../../types";
import { HistoryEntryCard } from "./command-history-viewer/HistoryEntryCard";
import { formatDate, formatExecutionTime } from "./command-history-viewer/utils";

interface CommandHistoryViewerProps {
	history?: readonly CommandHistoryEntry[];
	commands?: readonly Command[];
	onReplayCommand?: (commandId: string) => void;
	onClearHistory?: () => void;
	onFilterByCategory?: (category: string) => void;
	maxEntries?: number;
}

export function CommandHistoryViewer(props: CommandHistoryViewerProps) {
	const [local] = splitProps(props, [
		"history",
		"commands",
		"onReplayCommand",
		"onClearHistory",
		"onFilterByCategory",
		"maxEntries",
	]);

	const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
	const [showSuccessfulOnly, setShowSuccessfulOnly] = createSignal(false);

	const categories = createMemo(() => {
		const cats = new Set((local.commands ?? []).map((c) => c.category).filter(Boolean));
		return Array.from(cats) as string[];
	});

	const successfulCount = createMemo(() => (local.history ?? []).filter((h) => h.success).length);

	const failedCount = createMemo(() => (local.history ?? []).filter((h) => !h.success).length);

	const handleClearHistory = () => {
		local.onClearHistory?.();
	};

	return (
		<div class="command-history-viewer">
			<HistoryHeader
				total={local.history?.length ?? 0}
				successfulCount={successfulCount()}
				failedCount={failedCount()}
			/>

			<HistoryControls
				showSuccessfulOnly={showSuccessfulOnly()}
				onShowSuccessfulOnlyChange={setShowSuccessfulOnly}
				selectedCategory={selectedCategory()}
				onCategoryChange={setSelectedCategory}
				categories={categories()}
				onClearHistory={handleClearHistory}
			/>

			<HistoryList
				history={local.history}
				commands={local.commands}
				maxEntries={local.maxEntries}
				selectedCategory={selectedCategory}
				showSuccessfulOnly={showSuccessfulOnly}
				onReplayCommand={local.onReplayCommand}
			/>
		</div>
	);
}

interface HistoryHeaderProps {
	total: number;
	successfulCount: number;
	failedCount: number;
}

function HistoryHeader(props: HistoryHeaderProps) {
	return (
		<div class="history-header">
			<h2 class="history-title">Command History</h2>
			<div class="history-stats">
				<div class="stat-item">
					<span class="stat-label">Total:</span>
					<span class="stat-value">{props.total}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Success:</span>
					<span class="stat-value success">{props.successfulCount}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Failed:</span>
					<span class="stat-value failed">{props.failedCount}</span>
				</div>
			</div>
		</div>
	);
}

interface HistoryControlsProps {
	showSuccessfulOnly: boolean;
	onShowSuccessfulOnlyChange: (value: boolean) => void;
	selectedCategory: string | null;
	onCategoryChange: (value: string | null) => void;
	categories: readonly string[];
	onClearHistory: () => void;
}

function HistoryControls(props: HistoryControlsProps) {
	return (
		<div class="history-controls">
			<label class="filter-toggle">
				<input
					type="checkbox"
					checked={props.showSuccessfulOnly}
					onChange={(e) => props.onShowSuccessfulOnlyChange(e.currentTarget.checked)}
					class="toggle-checkbox"
				/>
				Show Successful Only
			</label>

			<select
				value={props.selectedCategory ?? ""}
				onChange={(e) => props.onCategoryChange(e.currentTarget.value || null)}
				class="category-filter"
			>
				<option value="">All Categories</option>
				<For each={props.categories}>{(category) => <option value={category}>{category}</option>}</For>
			</select>

			<button class="action-button clear" onClick={props.onClearHistory} type="button">
				Clear History
			</button>
		</div>
	);
}

interface HistoryListProps {
	history?: readonly CommandHistoryEntry[];
	commands?: readonly Command[];
	maxEntries?: number;
	selectedCategory: Accessor<string | null>;
	showSuccessfulOnly: Accessor<boolean>;
	onReplayCommand?: (commandId: string) => void;
}

function HistoryList(props: HistoryListProps) {
	const displayHistory = createMemo(() => {
		let filtered = props.history ?? [];

		if (props.showSuccessfulOnly()) {
			filtered = filtered.filter((entry) => entry.success);
		}

		if (props.selectedCategory()) {
			const categoryCommands = props.commands?.filter((c) => c.category === props.selectedCategory());
			const categoryCommandIds = new Set(categoryCommands?.map((c) => c.id));
			filtered = filtered.filter((entry) => categoryCommandIds.has(entry.commandId));
		}

		const limit = props.maxEntries ?? 50;
		return filtered.slice(0, limit);
	});

	const getCommandById = (commandId: string) => {
		return props.commands?.find((c) => c.id === commandId);
	};

	const handleReplay = (entry: CommandHistoryEntry) => {
		props.onReplayCommand?.(entry.commandId);
	};

	return (
		<div class="history-list">
			<For each={displayHistory()}>
				{(entry) => (
					<HistoryEntryCard
						entry={entry}
						command={getCommandById(entry.commandId)}
						formatExecutionTime={formatExecutionTime}
						formatDate={formatDate}
						onReplay={handleReplay}
					/>
				)}
			</For>

			<Show when={displayHistory().length === 0}>
				<div class="empty-state">
					<p class="empty-message">No command history</p>
				</div>
			</Show>
		</div>
	);
}
