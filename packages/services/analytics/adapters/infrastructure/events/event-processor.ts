/**
 * Event Processor implementation (Functional style)
 * Processes events with validation
 */

import type { Event, Result } from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

export const processEvent = async (_event: Event): Promise<Result<void>> => {
	// Add additional processing logic here
	// For example: enrichment, transformation, etc.

	return ok(undefined);
};

export const processEventBatch = async (
	events: Event[],
): Promise<Result<void>> => {
	for (const event of events) {
		const result = await processEvent(event);
		if (isErr(result)) {
			return err(result.error);
		}
	}
	return ok(undefined);
};

export const validateEventProcessor = (_event: Event): Result<Event> => {
	return ok(_event);
};
