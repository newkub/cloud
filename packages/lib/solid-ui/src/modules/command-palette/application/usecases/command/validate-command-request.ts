/**
 * Validate Command Request - Pure validation logic
 */

import type { Result } from "../../../shared/types";
import type { ExecuteCommandRequest } from "./execute-command-types";

export const validateExecuteCommandRequest = (request: ExecuteCommandRequest): Result<ExecuteCommandRequest> => {
	if (!request.commandId || request.commandId.trim().length === 0) {
		return {
			success: false,
			error: new Error("Command ID is required"),
		};
	}

	if (request.commandId.length > 50) {
		return {
			success: false,
			error: new Error("Command ID must be 50 characters or less"),
		};
	}

	return { success: true, data: request };
};
