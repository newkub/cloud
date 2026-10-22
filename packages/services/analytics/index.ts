/**
 * Analytics Module
 * Clean Architecture implementation for analytics tracking
 *
 * Structure:
 * - modules/analytics/      - Analytics module (Vertical Slice Architecture)
 *   - types/                - Domain types
 *   - domain/               - Domain layer (business logic)
 *     - operations/          - Pure business logic functions
 *     - models/              - Domain models
 *     - events/              - Domain events
 *     - validators/          - Domain validators
 *   - application/           - Application layer (orchestration)
 *     - usecases/            - Use case implementations
 *     - workflows/           - Workflow orchestrations
 *   - ports/                 - Interface definitions
 * - adapters/               - External systems integration
 * - presentation/           - Entry points
 *   - solid/                - SolidJS presentation layer
 * - shared/                 - Shared kernel
 */

// Public API exports from the analytics module
export {
	calculateFunnel,
	calculateRetentionUseCase,
	getFunnelAnalysis,
	getFunnelConversionRate,
	getRetentionAnalysis,
	type TrackEventCommand,
	type TrackEventDependencies,
	trackEvent,
} from "./modules/analytics/application/usecases";
export {
	createEventCreated,
	createSessionEnded,
	createSessionStarted,
	createUserIdentified,
} from "./modules/analytics/domain/events";
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
	validateEmail,
	validateEvent,
	validateEventName,
	validateEventProperties,
	validateEventUserId,
	validateSession,
	validateSessionId,
	validateSessionUserId,
	validateUser,
	validateUserId,
	validateUserName,
	validateUserProperties,
	validateUTMParameters,
	withProperties,
	withUserProperties,
} from "./modules/analytics/domain/operations";
export type {
	BatchProcessEvents,
	CacheClear,
	CacheDelete,
	CacheGet,
	CacheProvider,
	CacheSet,
	EventFilters,
	EventProcessor,
	EventRepository,
	FindActiveSessions,
	FindActiveUsers,
	FindEventById,
	FindEventsByDateRange,
	FindEventsByNames,
	FindEventsBySessionId,
	FindEventsByUserId,
	FindFunnelById,
	FindFunnelsByDateRange,
	FindRetentionByCohort,
	FindRetentionByDateRange,
	FindSessionById,
	FindSessionsByUserId,
	FindUserByEmail,
	FindUserById,
	FunnelRepository,
	GenerateId,
	GetCurrentTime,
	HttpClient,
	HttpDelete,
	HttpGet,
	HttpPost,
	HttpPut,
	IdGenerator,
	LogDebug,
	LogError,
	Logger,
	LogInfo,
	LogWarn,
	ProcessEvent,
	RetentionRepository,
	SaveEvent,
	SaveFunnel,
	SaveRetentionData,
	SaveSession,
	SaveUser,
	SessionRepository,
	TimeProvider,
	UserRepository,
	ValidateEvent,
} from "./modules/analytics/ports";
export type {
	Event,
	Funnel,
	Result,
	RetentionData,
	Session,
	User,
} from "./modules/analytics/types";
// Presentation layer exports are available via `@wrikka/solid-framework/analytics/solid`.
