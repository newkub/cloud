/**
 * Domain Operations Index
 * Exports all domain operations
 */

export * from "../events";
export * from "../validators";
export {
	getDefaultConfig,
	mergeConfig,
} from "./config-operations";
export {
	createEvent,
	createIdentify,
	createPageView,
	createRevenue,
	eventToJSON,
	eventToObject,
	utmParametersToObject,
	withProperties,
} from "./event-operations";
export {
	calculateConversionRate,
	calculateFunnelSteps,
	createFunnel,
	funnelToObject,
	getFunnelInsights,
} from "./funnel-operations";
export {
	createIdentifyHandler,
	createPageHandler,
	createTrackHandler,
} from "./handler-operations";
export type { Cohort } from "./retention-operations";
export {
	calculateRetention,
	cohortToObject,
	createCohort,
	getAverageRetentionRate,
	getRetentionAtPeriod,
} from "./retention-operations";
export {
	createSession,
	endSession,
	getSessionDuration,
	incrementEvents,
	incrementPageViews,
	isSessionActive,
	sessionFromData,
	sessionToObject,
} from "./session-operations";
export {
	createUser,
	incrementUserEvents,
	incrementUserPageViews,
	incrementUserSessions,
	isUserActive,
	updateUserActivity,
	userToObject,
	withUserProperties,
} from "./user-operations";
