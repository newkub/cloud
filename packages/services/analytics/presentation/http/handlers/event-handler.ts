/**
 * Event HTTP Handlers
 * HTTP endpoints for event operations
 */

import type {
	TrackEventCommand,
	TrackEventDependencies,
} from "#analytics/modules/analytics/application/usecases";
import { trackEvent } from "#analytics/modules/analytics/application/usecases";
import type { Result } from "#analytics/modules/analytics/types";
import { err, isErr, unwrap, unwrapErr } from "#analytics/shared/utils/result";

export interface EventHandlerDependencies extends TrackEventDependencies {
	validateRequest(request: unknown): Result<TrackEventCommand>;
	formatResponse<T>(result: Result<T>): Response;
}

export const createEventHandler = (dependencies: EventHandlerDependencies) => ({
	async handleTrackEvent(request: unknown): Promise<Response> {
		// Validate request
		const commandResult = dependencies.validateRequest(request);
		if (isErr(commandResult)) {
			return dependencies.formatResponse(err(unwrapErr(commandResult)));
		}

		// Execute use case
		const result = await trackEvent(dependencies, unwrap(commandResult));
		return dependencies.formatResponse(result);
	},

	async handleTrackPageView(request: unknown): Promise<Response> {
		if (typeof request !== "object" || request === null) {
			return dependencies.formatResponse(
				err(new Error("Invalid request: expected object")),
			);
		}
		const commandResult = dependencies.validateRequest({
			...(request as Record<string, unknown>),
			type: "page_view" as const,
		});

		if (isErr(commandResult)) {
			return dependencies.formatResponse(err(unwrapErr(commandResult)));
		}

		const result = await trackEvent(dependencies, unwrap(commandResult));
		return dependencies.formatResponse(result);
	},

	async handleIdentifyUser(request: unknown): Promise<Response> {
		if (typeof request !== "object" || request === null) {
			return dependencies.formatResponse(
				err(new Error("Invalid request: expected object")),
			);
		}
		const commandResult = dependencies.validateRequest({
			...(request as Record<string, unknown>),
			type: "identify" as const,
		});

		if (isErr(commandResult)) {
			return dependencies.formatResponse(err(unwrapErr(commandResult)));
		}

		const result = await trackEvent(dependencies, unwrap(commandResult));
		return dependencies.formatResponse(result);
	},

	async handleTrackRevenue(request: unknown): Promise<Response> {
		if (typeof request !== "object" || request === null) {
			return dependencies.formatResponse(
				err(new Error("Invalid request: expected object")),
			);
		}
		const commandResult = dependencies.validateRequest({
			...(request as Record<string, unknown>),
			type: "revenue" as const,
		});

		if (isErr(commandResult)) {
			return dependencies.formatResponse(err(unwrapErr(commandResult)));
		}

		const result = await trackEvent(dependencies, unwrap(commandResult));
		return dependencies.formatResponse(result);
	},
});
