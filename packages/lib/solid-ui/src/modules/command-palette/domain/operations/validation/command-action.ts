/**
 * Validate Command Action - Single responsibility for action validation
 * Pure function for validating command actions only
 */

import type { Result } from "../../../shared/types";
import type { CommandAction } from "../../../types";

export const validateCommandAction = (action: CommandAction): Result<CommandAction> => {
	const validTypes = ["url", "function", "plugin", "system"] as const;

	if (!validTypes.includes(action.type)) {
		return {
			success: false,
			error: new Error(`Invalid action type: ${action.type}. Must be one of: ${validTypes.join(", ")}`),
		};
	}

	// Validate payload based on action type
	const payloadResult = validateActionPayload(action.type, action.payload);
	if (!payloadResult.success) {
		return { success: false, error: payloadResult.error };
	}

	return { success: true, data: action };
};

// Helper function to validate action payload
const validateActionPayload = (type: string, payload: unknown): Result<unknown> => {
	switch (type) {
		case "url":
			if (typeof payload !== "string") {
				return {
					success: false,
					error: new Error("URL action payload must be a string"),
				};
			}

			try {
				new URL(payload);
				return { success: true, data: payload };
			} catch {
				return {
					success: false,
					error: new Error("Invalid URL in action payload"),
				};
			}

		case "function":
			if (typeof payload !== "string" && typeof payload !== "object") {
				return {
					success: false,
					error: new Error("Function action payload must be a string or object"),
				};
			}
			return { success: true, data: payload };

		case "plugin":
			if (typeof payload !== "object" || payload === null) {
				return {
					success: false,
					error: new Error("Plugin action payload must be an object"),
				};
			}
			return { success: true, data: payload };

		case "system":
			if (typeof payload !== "string") {
				return {
					success: false,
					error: new Error("System action payload must be a string"),
				};
			}
			return { success: true, data: payload };

		default:
			return {
				success: false,
				error: new Error(`Unknown action type: ${type}`),
			};
	}
};
