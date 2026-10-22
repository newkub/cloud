/**
 * Validate Command - Refactored with Single Responsibility Principle
 * Orchestrates focused validation operations
 */

import type { Result } from "../../../shared/types";
import type { CommandRequest } from "../../../types";
import { validateCommandAction } from "./command-action";
import { validateCommandHotkey } from "./hotkey";
import { validateCommandKeywords } from "./keywords";
import { validateCommandLabel } from "./label";

export const validateCommandRequest = (request: CommandRequest): Result<CommandRequest> => {
	// Validate each field with its dedicated validator
	const labelResult = validateCommandLabel(request.label);
	if (!labelResult.success) {
		return labelResult;
	}

	const actionResult = validateCommandAction(request.action);
	if (!actionResult.success) {
		return actionResult;
	}

	// Validate optional fields only if provided
	if (request.keywords) {
		const keywordsResult = validateCommandKeywords(request.keywords);
		if (!keywordsResult.success) {
			return keywordsResult;
		}
	}

	if (request.hotkey) {
		const hotkeyResult = validateCommandHotkey(request.hotkey);
		if (!hotkeyResult.success) {
			return hotkeyResult;
		}
	}

	// All validations passed
	return { success: true, data: request };
};
