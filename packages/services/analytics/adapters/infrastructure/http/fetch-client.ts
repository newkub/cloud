/**
 * Fetch Client implementation (Functional style)
 * HTTP client using fetch API
 */

import type {
	AnalyticsConfig,
	Result,
} from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export type FetchClientDependencies = Readonly<{
	readonly defaultHeaders?: Record<string, string>;
	readonly defaultTimeout?: number;
}>;

export const createFetchClient = (
	dependencies: FetchClientDependencies = {},
): FetchClientDependencies => ({
	defaultHeaders: dependencies.defaultHeaders || {},
	defaultTimeout: dependencies.defaultTimeout || 30_000,
});

export const httpPost = async (
	dependencies: FetchClientDependencies,
	url: string,
	data: unknown,
	options?: RequestInit,
): Promise<Result<Response>> => {
	return httpRequest(dependencies, url, {
		...options,
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...dependencies.defaultHeaders,
			...options?.headers,
		},
	});
};

export const httpGet = async (
	dependencies: FetchClientDependencies,
	url: string,
	options?: RequestInit,
): Promise<Result<Response>> => {
	return httpRequest(dependencies, url, {
		...options,
		method: "GET",
		headers: {
			...dependencies.defaultHeaders,
			...options?.headers,
		},
	});
};

export const httpPut = async (
	dependencies: FetchClientDependencies,
	url: string,
	data: unknown,
	options?: RequestInit,
): Promise<Result<Response>> => {
	return httpRequest(dependencies, url, {
		...options,
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...dependencies.defaultHeaders,
			...options?.headers,
		},
	});
};

export const httpDelete = async (
	dependencies: FetchClientDependencies,
	url: string,
	options?: RequestInit,
): Promise<Result<Response>> => {
	return httpRequest(dependencies, url, {
		...options,
		method: "DELETE",
		headers: {
			...dependencies.defaultHeaders,
			...options?.headers,
		},
	});
};

const httpRequest = async (
	_dependencies: FetchClientDependencies,
	url: string,
	options: RequestInit,
): Promise<Result<Response>> => {
	try {
		const timeout = 30_000;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return err(new Error(`HTTP error! status: ${response.status}`));
		}

		return ok(response);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return err(new Error("Request timeout"));
		}
		return err(error instanceof Error ? error : new Error("Request failed"));
	}
};

/**
 * Send analytics events to endpoint
 * Specific function for analytics event submission
 */
export type AnalyticsEvent = Readonly<{
	readonly type: string;
	readonly data: Record<string, unknown>;
}>;

export interface AnalyticsSendError extends Error {
	name: "AnalyticsSendError";
	eventCount: number;
	cause?: Error;
}

export function createAnalyticsSendError(
	message: string,
	eventCount: number,
	cause?: Error,
): AnalyticsSendError {
	const error = Object.create(Error.prototype) as AnalyticsSendError;
	Object.defineProperties(error, {
		name: { value: "AnalyticsSendError" },
		message: { value: message },
		eventCount: { value: eventCount, enumerable: true },
		cause: { value: cause, enumerable: true },
	});
	return error;
}

export async function sendToEndpoint(
	events: AnalyticsEvent[],
	config: AnalyticsConfig,
): Promise<Result<void, AnalyticsSendError>> {
	if (!config.endpoint) {
		return { success: true, data: undefined as undefined };
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10_000);

		const response = await fetch(config.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${config.apiKey || ""}`,
			},
			body: JSON.stringify({
				events,
				consent: config.consent,
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return err(
				createAnalyticsSendError(
					`Failed to send analytics: HTTP ${response.status}`,
					events.length,
				),
			);
		}

		return { success: true, data: undefined as undefined };
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return err(
				createAnalyticsSendError("Analytics request timeout", events.length),
			);
		}

		return err(
			createAnalyticsSendError(
				error instanceof Error
					? error.message
					: "Failed to send analytics events",
				events.length,
				error instanceof Error ? error : undefined,
			),
		);
	}
}
