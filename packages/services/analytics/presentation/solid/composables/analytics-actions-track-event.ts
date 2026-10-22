// Track event action

import { trackEvent as trackEventUseCase } from "#analytics/modules/analytics/application/usecases";
import type { EventRepository } from "#analytics/modules/analytics/ports";
import type { Event, EventType } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createTrackEventAction = (
	state: AnalyticsState & AnalyticsStateMutators,
	repositories: {
		eventRepository: EventRepository;
		sessionRepository: unknown;
	},
) => {
	return async (event: Omit<Event, "id" | "timestamp">) => {
		try {
			// Use the trackEvent use case instead of direct repository call
			const result = await trackEventUseCase(
				{
					eventRepository: repositories.eventRepository,
					eventProcessor: {
						validate: (e: Event) => ({ success: true, data: e }),
						process: async (e: Event) => ({ success: true, data: e }),
						batch: async (events: readonly Event[]) => ({
							success: true,
							data: events,
						}),
					},
					sessionRepository: repositories.sessionRepository as any,
					idGenerator: {
						generate: (
							randomUUID: () => string = (
								randomUUID: () => string = () => crypto.randomUUID(),
							) => randomUUID(),
						) => randomUUID(),
					},
					timeProvider: { now: (now: number = Date.now()) => now },
				},
				{
					type: event.name as EventType,
					name: event.name,
					properties: event.properties,
					sessionId: event.sessionId || "default",
					...(event.userId !== undefined && { userId: event.userId }),
					...(event.utmParameters !== undefined && {
						utmParameters: event.utmParameters,
					}),
				},
			);

			if (result.success && result.data) {
				state.setData({
					...state.data(),
					events: [result.data, ...state.data().events],
				});
			} else {
				state.setError("Failed to track event");
			}
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to track event",
			);
		}
	};
};
