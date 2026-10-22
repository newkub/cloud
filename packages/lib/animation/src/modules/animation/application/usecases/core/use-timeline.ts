import { createTimelineAdapter } from "../../../../../adapters/adapter-base";
import type { TimelineInstance, TimelineOptions } from "../../../types/index";

/**
 * Use case: Create and manage animation timeline
 */
export function createTimelineFactory() {
	return function createTimelineWrapper(options?: TimelineOptions): TimelineInstance {
		return options ? createTimelineAdapter(options) : createTimelineAdapter();
	};
}
