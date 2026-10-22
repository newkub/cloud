/**
 * Validate Command Label - Single responsibility for label validation
 * Pure function for validating command labels only
 */

import type { Result } from "../../../shared/types";
import { validateString } from "../../../shared/utils";

export const validateCommandLabel = (label: string): Result<string> => {
	// Validate required string
	const stringResult = validateString(label, "label");
	if (!stringResult.success) {
		return stringResult;
	}

	// Validate length
	if (label.length > 100) {
		return {
			success: false,
			error: new Error("Command label must be 100 characters or less"),
		};
	}

	// Validate not empty after trimming
	if (label.trim().length === 0) {
		return {
			success: false,
			error: new Error("Command label cannot be empty"),
		};
	}

	return { success: true, data: label };
};
