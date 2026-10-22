/**
 * Validate Command Keywords - Single responsibility for keyword validation
 * Pure function for validating command keywords only
 */

import type { Result } from "../../../shared/types";
import { validateString } from "../../../shared/utils";

export const validateCommandKeywords = (keywords: readonly string[]): Result<readonly string[]> => {
	// Validate array size
	if (keywords.length > 10) {
		return {
			success: false,
			error: new Error("Maximum 10 keywords allowed per command"),
		};
	}

	// Validate each keyword
	for (const keyword of keywords) {
		const keywordResult = validateString(keyword, "keyword");
		if (!keywordResult.success) {
			return { success: false, error: keywordResult.error };
		}

		// Validate keyword length
		if (keyword.length > 50) {
			return {
				success: false,
				error: new Error("Each keyword must be 50 characters or less"),
			};
		}
	}

	// Check for duplicates
	const uniqueKeywords = Array.from(new Set(keywords.map((k) => k.toLowerCase())));
	if (uniqueKeywords.length !== keywords.length) {
		return {
			success: false,
			error: new Error("Duplicate keywords are not allowed"),
		};
	}

	return { success: true, data: keywords };
};
