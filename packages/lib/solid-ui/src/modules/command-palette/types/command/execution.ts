/**
 * Command Execution Types
 */

export interface CommandExecutionContext {
	readonly timestamp: Date;
	readonly userId?: string;
	readonly sessionId?: string;
	readonly metadata?: readonly Record<string, unknown>[];
}

export interface CommandExecutionResult {
	readonly commandId: string;
	readonly success: boolean;
	readonly result?: unknown;
	readonly error?: string;
	readonly executionTime: number;
	readonly context: CommandExecutionContext;
}
