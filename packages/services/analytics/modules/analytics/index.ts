/**
 * Analytics Module Public API
 * Exports all public interfaces and functions for the analytics module
 */

// Application use cases (orchestration layer)
export {
	calculateFunnel,
	calculateRetentionUseCase,
	getFunnelAnalysis,
	getFunnelConversionRate,
	getRetentionAnalysis,
	type TrackEventCommand,
	type TrackEventDependencies,
	trackEvent,
} from "./application/usecases";
// Domain events
export {
	createEventCreated,
	createSessionEnded,
	createSessionStarted,
	createUserIdentified,
} from "./domain/events";
// Domain operations (pure business logic)
export {
	type Cohort,
	calculateConversionRate,
	calculateFunnelSteps,
	calculateRetention,
	cohortToObject,
	createCohort,
	createEvent,
	createFunnel,
	createIdentify,
	createIdentifyHandler,
	createPageHandler,
	createPageView,
	createRevenue,
	createSession,
	createTrackHandler,
	createUser,
	endSession,
	eventToJSON,
	eventToObject,
	funnelToObject,
	getAverageRetentionRate,
	getDefaultConfig,
	getFunnelInsights,
	getRetentionAtPeriod,
	getSessionDuration,
	incrementEvents,
	incrementPageViews,
	incrementUserEvents,
	incrementUserPageViews,
	incrementUserSessions,
	isSessionActive,
	isUserActive,
	mergeConfig,
	sessionFromData,
	sessionToObject,
	updateUserActivity,
	userToObject,
	utmParametersToObject,
	withProperties,
	withUserProperties,
} from "./domain/operations";
// Ports (interface definitions for external dependencies)
export type {
	CacheProvider,
	EventFilters,
	EventProcessor,
	EventRepository,
	FunnelRepository,
	HttpClient,
	IdGenerator,
	Logger,
	RetentionRepository,
	SessionRepository,
	TimeProvider,
	UserRepository,
} from "./ports";
// Domain types
export type {
	Event,
	Funnel,
	Result,
	RetentionData,
	Session,
	User,
} from "./types";
