/**
 * Core Command Types
 */

export interface Command {
	readonly id: string;
	readonly label: string;
	readonly description?: string;
	readonly icon?: string;
	readonly keywords?: readonly string[];
	readonly action: CommandAction;
	readonly category?: string;
	readonly hotkey?: string;
	readonly enabled: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly executionCount?: number;
	readonly lastExecutedAt?: string;
	readonly isFavorite?: boolean;
	readonly aliases?: readonly string[];
	readonly subcommands?: readonly Command[];
	readonly preview?: CommandPreview;
	readonly rating?: number;
	readonly tags?: readonly string[];
	readonly isPinned?: boolean;
}

export interface CommandPreview {
	readonly type: "text" | "image" | "component";
	readonly content: string;
	readonly title?: string;
}

export interface CommandAction {
	readonly type: "url" | "function" | "plugin" | "system";
	readonly payload: unknown;
}

export interface CommandRequest {
	readonly label: string;
	readonly description?: string;
	readonly icon?: string;
	readonly keywords?: readonly string[];
	readonly action: CommandAction;
	readonly category?: string;
	readonly hotkey?: string;
}
