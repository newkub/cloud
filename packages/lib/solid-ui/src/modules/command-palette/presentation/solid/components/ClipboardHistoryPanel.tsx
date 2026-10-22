/**
 * ClipboardHistoryPanel - SolidJS component for clipboard history management
 */

import { createMemo, createSignal, For, Show, splitProps } from "solid-js";
import type { ClipboardEntry, ClipboardHistory } from "../../../types";

interface ClipboardHistoryPanelProps {
	history: ClipboardHistory;
	onCopyEntry?: (content: string) => void;
	onDeleteEntry?: (entryId: string) => void;
	onClearAll?: () => void;
	maxEntries?: number;
}

const getEntryIcon = (type: ClipboardEntry["type"]) => {
	switch (type) {
		case "text":
			return "📝";
		case "image":
			return "🖼️";
		case "file":
			return "📁";
		default:
			return "📋";
	}
};

const formatTimestamp = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};

const truncateContent = (content: string, maxLength = 100) => {
	if (content.length <= maxLength) return content;
	return `${content.slice(0, maxLength)}...`;
};

export function ClipboardHistoryPanel(props: ClipboardHistoryPanelProps) {
	const [local] = splitProps(props, ["history", "onCopyEntry", "onDeleteEntry", "onClearAll", "maxEntries"]);

	const displayHistory = createMemo(() => {
		const limit = local.maxEntries ?? 50;
		return local.history.slice(0, limit);
	});

	const entryCount = createMemo(() => local.history.length);

	const handleCopy = (entry: ClipboardEntry) => {
		local.onCopyEntry?.(entry.content);
	};

	const handleDelete = (entryId: string) => {
		local.onDeleteEntry?.(entryId);
	};

	const handleClearAll = () => {
		local.onClearAll?.();
	};

	return (
		<div class="clipboard-history-panel">
			<div class="panel-header">
				<h2 class="panel-title">Clipboard History</h2>
				<div class="panel-stats">
					<span class="stat-item">{entryCount()} entries</span>
				</div>
			</div>

			<div class="panel-actions">
				<button class="action-button clear" onClick={handleClearAll} disabled={entryCount() === 0} type="button">
					Clear All
				</button>
			</div>

			<div class="history-list">
				<Show when={displayHistory().length > 0} fallback={<EmptyState />}>
					<For each={displayHistory()}>
						{(entry) => (
							<ClipboardEntryCard
								entry={entry}
								icon={getEntryIcon(entry.type)}
								truncateContent={truncateContent}
								formatTimestamp={formatTimestamp}
								onCopy={handleCopy}
								onDelete={handleDelete}
							/>
						)}
					</For>
				</Show>
			</div>
		</div>
	);
}

interface ClipboardEntryCardProps {
	entry: ClipboardEntry;
	icon: string;
	truncateContent: (content: string, maxLength?: number) => string;
	formatTimestamp: (date: Date) => string;
	onCopy: (entry: ClipboardEntry) => void;
	onDelete: (entryId: string) => void;
}

function ClipboardEntryCard(props: ClipboardEntryCardProps) {
	const [local] = splitProps(props, ["entry", "icon", "truncateContent", "formatTimestamp", "onCopy", "onDelete"]);

	const [isExpanded, setIsExpanded] = createSignal(false);

	const handleCopy = () => {
		local.onCopy(local.entry);
	};

	const handleDelete = () => {
		local.onDelete(local.entry.id);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded());
	};

	return (
		<div class="clipboard-entry-card">
			<div class="entry-header">
				<div class="entry-info">
					<span class="entry-icon">{local.icon}</span>
					<span class="entry-type">{local.entry.type}</span>
					<span class="entry-time">{local.formatTimestamp(local.entry.timestamp)}</span>
				</div>
				<div class="entry-actions">
					<button class="action-button copy" onClick={handleCopy} type="button" title="Copy to clipboard">
						Copy
					</button>
					<button class="action-button delete" onClick={handleDelete} type="button" title="Delete entry">
						Delete
					</button>
				</div>
			</div>

			<EntryContent entry={local.entry} isExpanded={isExpanded()} truncateContent={local.truncateContent} />

			<Show when={local.entry.content.length > 100}>
				<button class="expand-button" onClick={toggleExpand} type="button">
					{isExpanded() ? "Show Less" : "Show More"}
				</button>
			</Show>

			<EntryMetadata entry={local.entry} />
		</div>
	);
}

interface EntryContentProps {
	entry: ClipboardEntry;
	isExpanded: boolean;
	truncateContent: (content: string, maxLength?: number) => string;
}

function EntryContent(props: EntryContentProps) {
	return (
		<div class="entry-content">
			<Show
				when={props.isExpanded}
				fallback={<p class="content-preview">{props.truncateContent(props.entry.content)}</p>}
			>
				<pre class="content-full">{props.entry.content}</pre>
			</Show>
		</div>
	);
}

function EntryMetadata(props: { entry: ClipboardEntry }) {
	return (
		<Show when={props.entry.metadata && Object.keys(props.entry.metadata).length > 0}>
			<div class="entry-metadata">
				<For each={Object.entries(props.entry.metadata ?? {})}>
					{([key, value]) => (
						<div class="metadata-item">
							<span class="metadata-key">{key}:</span>
							<span class="metadata-value">{String(value)}</span>
						</div>
					)}
				</For>
			</div>
		</Show>
	);
}

function EmptyState() {
	return (
		<div class="empty-state">
			<div class="empty-icon">📋</div>
			<p class="empty-message">No clipboard history</p>
			<p class="empty-hint">Copy items to see them here</p>
		</div>
	);
}
