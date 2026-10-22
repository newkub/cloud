/**
 * Execute Command Use Case - Request and response types
 */

import type { Command, CommandExecutionContext, CommandExecutionResult } from "../../../types";

export interface ExecuteCommandRequest {
	readonly commandId: string;
	readonly context?: Partial<CommandExecutionContext>;
}

export interface ExecuteCommandResponse {
	readonly command: Command;
	readonly result: CommandExecutionResult;
}
