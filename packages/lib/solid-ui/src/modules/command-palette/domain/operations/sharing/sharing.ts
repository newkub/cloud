/**
 * Sharing Operations - Domain operations for command sharing
 * Pure functions for sharing commands via various methods
 */

import type { Command } from "../../../types";

export interface ShareData {
	readonly command: Command;
	readonly format: "json" | "url" | "text";
	readonly timestamp: Date;
}

/**
 * Serialize command to JSON
 */
export const serializeCommand = (command: Command): string => {
	return JSON.stringify(command, null, 2);
};

/**
 * Deserialize command from JSON
 */
export const deserializeCommand = (json: string): Command => {
	return JSON.parse(json) as Command;
};

/**
 * Generate shareable URL for a command
 */
export const generateShareUrl = (command: Command, baseUrl: string): string => {
	const params = new URLSearchParams({
		id: command.id,
		label: command.label,
		description: command.description || "",
	});
	return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate shareable text format
 */
export const generateShareText = (command: Command): string => {
	const lines = [
		`Command: ${command.label}`,
		command.description ? `Description: ${command.description}` : null,
		command.category ? `Category: ${command.category}` : null,
		command.hotkey ? `Shortcut: ${command.hotkey}` : null,
	]
		.filter((line): line is string => line !== null)
		.join("\n");

	return lines;
};

/**
 * Generate share data
 */
export const generateShareData = (command: Command, format: ShareData["format"]): ShareData => ({
	command,
	format,
	timestamp: new Date(),
});

/**
 * Validate share data
 */
export const validateShareData = (data: unknown): data is ShareData => {
	if (typeof data !== "object" || data === null) return false;
	const shareData = data as ShareData;
	return (
		typeof shareData.command === "object" &&
		shareData.command !== null &&
		typeof shareData.format === "string" &&
		["json", "url", "text"].includes(shareData.format) &&
		shareData.timestamp instanceof Date
	);
};

/**
 * Copy command to clipboard (text format)
 */
export const copyCommandToClipboard = async (command: Command): Promise<boolean> => {
	try {
		const text = generateShareText(command);
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
};

/**
 * Export commands to JSON
 */
export const exportCommandsToJson = (commands: readonly Command[]): string => {
	return JSON.stringify(commands, null, 2);
};

/**
 * Import commands from JSON
 */
export const importCommandsFromJson = (json: string): readonly Command[] => {
	try {
		const commands = JSON.parse(json) as Command[];
		if (!Array.isArray(commands)) {
			throw new Error("Invalid commands format");
		}
		return commands;
	} catch {
		throw new Error("Failed to parse commands JSON");
	}
};

/**
 * Generate shareable link for multiple commands
 */
export const generateCommandsShareUrl = (commands: readonly Command[], baseUrl: string): string => {
	const commandIds = commands.map((cmd) => cmd.id).join(",");
	return `${baseUrl}?ids=${commandIds}`;
};
