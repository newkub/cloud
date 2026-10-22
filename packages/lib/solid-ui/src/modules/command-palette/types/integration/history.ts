/**
 * Command History Types
 */

export interface CommandHistoryEntry {
	readonly id: string;
	readonly commandId: string;
	readonly executedAt: Date;
	readonly executionTime: number;
	readonly success: boolean;
	readonly result?: unknown;
	readonly error?: string;
}

export type CommandHistory = readonly CommandHistoryEntry[];
