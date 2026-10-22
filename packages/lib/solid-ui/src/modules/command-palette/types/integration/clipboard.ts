/**
 * Clipboard Types
 */

export interface ClipboardEntry {
	readonly id: string;
	readonly content: string;
	readonly type: "text" | "image" | "file";
	readonly timestamp: Date;
	readonly metadata?: Record<string, unknown>;
}

export type ClipboardHistory = readonly ClipboardEntry[];

export const createClipboardHistory = (): ClipboardHistory => [];

export const addClipboardEntry = (
	history: ClipboardHistory,
	content: string,
	type: ClipboardEntry["type"] = "text",
): ClipboardHistory => [
	{
		id: `clipboard-${Date.now()}`,
		content,
		type,
		timestamp: new Date(),
	},
	...history,
];

export const getRecentClipboardEntries = (history: ClipboardHistory, limit?: number): readonly ClipboardEntry[] => {
	if (!limit) return history;
	return history.slice(0, limit);
};
