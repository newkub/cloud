// Search query validation

import type { Result } from "../../../shared/types";
import type { CommandSearchQuery } from "../../../types";

export const validateSearchQuery = (query: CommandSearchQuery): Result<CommandSearchQuery> => {
	// Validate query string if provided
	if (query.query !== undefined) {
		if (typeof query.query !== "string") {
			return {
				success: false,
				error: new Error("Query must be a string"),
			};
		}

		if (query.query.length > 100) {
			return {
				success: false,
				error: new Error("Query must be 100 characters or less"),
			};
		}
	}

	// Validate limit if provided
	if (query.limit !== undefined) {
		if (typeof query.limit !== "number" || query.limit < 1 || query.limit > 100) {
			return {
				success: false,
				error: new Error("Limit must be a number between 1 and 100"),
			};
		}
	}

	// Validate offset if provided
	if (query.offset !== undefined) {
		if (typeof query.offset !== "number" || query.offset < 0) {
			return {
				success: false,
				error: new Error("Offset must be a non-negative number"),
			};
		}
	}

	// Validate category if provided
	if (query.category !== undefined) {
		if (typeof query.category !== "string" || query.category.trim().length === 0) {
			return {
				success: false,
				error: new Error("Category must be a non-empty string"),
			};
		}
	}

	return { success: true, data: query };
};
