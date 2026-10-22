/**
 * REST Adapter - REST API interface for command palette
 * Provides HTTP client for remote command synchronization
 */

import type { Result } from "../../shared/types";
import type { Command } from "../../types";

export type RestClientConfig = Readonly<{
	baseUrl: string;
	apiKey?: string;
	timeout?: number;
}>;

export type RestClientState = Readonly<{
	config: RestClientConfig;
}>;

export const createRestClient = (config: RestClientConfig): RestClientState => ({ config });

export const fetchCommands = async (state: RestClientState): Promise<Result<readonly Command[]>> => {
	try {
		const response = await fetch(`${state.config.baseUrl}/commands`, {
			headers: {
				"Content-Type": "application/json",
				...(state.config.apiKey && {
					Authorization: `Bearer ${state.config.apiKey}`,
				}),
			},
			signal: AbortSignal.timeout(state.config.timeout || 5000),
		});

		if (!response.ok) {
			throw new Error(`HTTP error: status ${response.status}`);
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const syncCommand = async (state: RestClientState, command: Command): Promise<Result<Command>> => {
	try {
		const response = await fetch(`${state.config.baseUrl}/commands`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(state.config.apiKey && {
					Authorization: `Bearer ${state.config.apiKey}`,
				}),
			},
			body: JSON.stringify(command),
			signal: AbortSignal.timeout(state.config.timeout || 5000),
		});

		if (!response.ok) {
			throw new Error(`HTTP error: status ${response.status}`);
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const deleteRemoteCommand = async (state: RestClientState, id: string): Promise<Result<void>> => {
	try {
		const response = await fetch(`${state.config.baseUrl}/commands/${id}`, {
			method: "DELETE",
			headers: {
				...(state.config.apiKey && {
					Authorization: `Bearer ${state.config.apiKey}`,
				}),
			},
			signal: AbortSignal.timeout(state.config.timeout || 5000),
		});

		if (!response.ok) {
			throw new Error(`HTTP error: status ${response.status}`);
		}

		return { success: true, data: undefined };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};
