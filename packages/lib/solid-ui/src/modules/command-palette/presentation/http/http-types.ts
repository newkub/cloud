/**
 * HTTP Request/Response Types
 */

export interface HttpResponse<T = unknown> {
	readonly statusCode: number;
	readonly body?: T;
	readonly headers?: Record<string, string>;
	readonly error?: {
		readonly code: string;
		readonly message: string;
		readonly details?: unknown;
	};
}

export interface CreateCommandRequest {
	readonly label: string;
	readonly description?: string;
	readonly icon?: string;
	readonly keywords?: readonly string[];
	readonly action: {
		readonly type: "url" | "function" | "plugin" | "system";
		readonly payload: unknown;
	};
	readonly category?: string;
	readonly hotkey?: string;
}

export interface SearchCommandsRequest {
	readonly query?: string;
	readonly category?: string;
	readonly enabled?: boolean;
	readonly limit?: number;
	readonly offset?: number;
}

export interface ExecuteCommandRequest {
	readonly commandId: string;
	readonly context?: {
		readonly userId?: string;
		readonly sessionId?: string;
		readonly metadata?: readonly Record<string, unknown>[];
	};
}
