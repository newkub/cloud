/**
 * Analytics Module Ports
 * Function type definitions for external dependencies (FP style)
 */

import type {
	Event,
	Funnel,
	Result,
	RetentionData,
	Session,
	User,
} from "#analytics/modules/analytics/types";

// Event Filters type
export type EventFilters = {
	readonly userId?: string;
	readonly properties?: Record<string, unknown>;
	readonly eventTypes?: readonly string[];
	readonly dateRange?: {
		readonly start: number;
		readonly end: number;
	};
};

// Event Repository function types
export type SaveEvent = (event: Event) => Promise<Result<Event>>;
export type FindEventById = (id: string) => Promise<Result<Event | null>>;
export type FindEventsBySessionId = (
	sessionId: string,
) => Promise<Result<readonly Event[]>>;
export type FindEventsByUserId = (
	userId: string,
) => Promise<Result<readonly Event[]>>;
export type FindEventsByDateRange = (
	start: number,
	end: number,
	filters?: EventFilters,
) => Promise<Result<readonly Event[]>>;
export type FindEventsByNames = (
	names: readonly string[],
	filters?: EventFilters,
) => Promise<Result<readonly Event[]>>;

export type EventRepository = {
	readonly save: SaveEvent;
	readonly findById: FindEventById;
	readonly findBySessionId: FindEventsBySessionId;
	readonly findByUserId: FindEventsByUserId;
	readonly findByDateRange: FindEventsByDateRange;
	readonly findByEventNames: FindEventsByNames;
};

// Session Repository function types
export type SaveSession = (session: Session) => Promise<Result<Session>>;
export type FindSessionById = (id: string) => Promise<Result<Session | null>>;
export type FindSessionsByUserId = (
	userId: string,
) => Promise<Result<readonly Session[]>>;
export type FindActiveSessions = (
	maxAge: number,
) => Promise<Result<readonly Session[]>>;

export type SessionRepository = {
	readonly save: SaveSession;
	readonly findById: FindSessionById;
	readonly findByUserId: FindSessionsByUserId;
	readonly findActiveSessions: FindActiveSessions;
};

// User Repository function types
export type SaveUser = (user: User) => Promise<Result<User>>;
export type FindUserById = (id: string) => Promise<Result<User | null>>;
export type FindUserByEmail = (email: string) => Promise<Result<User | null>>;
export type FindActiveUsers = (
	maxInactiveDays: number,
) => Promise<Result<readonly User[]>>;

export type UserRepository = {
	readonly save: SaveUser;
	readonly findById: FindUserById;
	readonly findByEmail: FindUserByEmail;
	readonly findActiveUsers: FindActiveUsers;
};

// Event Processor function types
export type ProcessEvent = (event: Event) => Promise<Result<Event>>;
export type ValidateEvent = (event: Event) => Result<Event>;
export type BatchProcessEvents = (
	events: readonly Event[],
) => Promise<Result<readonly Event[]>>;

export type EventProcessor = {
	readonly process: ProcessEvent;
	readonly validate: ValidateEvent;
	readonly batch: BatchProcessEvents;
};

// Cache Provider function types
export type CacheGet = <T>(key: string) => Promise<Result<T | null>>;
export type CacheSet = <T>(
	key: string,
	value: T,
	ttl?: number,
) => Promise<Result<void>>;
export type CacheDelete = (key: string) => Promise<Result<void>>;
export type CacheClear = () => Promise<Result<void>>;

export type CacheProvider = {
	readonly get: CacheGet;
	readonly set: CacheSet;
	readonly delete: CacheDelete;
	readonly clear: CacheClear;
};

// HTTP Client function types
export type HttpGet = <T>(
	url: string,
	headers?: Record<string, string>,
) => Promise<Result<T>>;
export type HttpPost = <T>(
	url: string,
	body: unknown,
	headers?: Record<string, string>,
) => Promise<Result<T>>;
export type HttpPut = <T>(
	url: string,
	body: unknown,
	headers?: Record<string, string>,
) => Promise<Result<T>>;
export type HttpDelete = <T>(
	url: string,
	headers?: Record<string, string>,
) => Promise<Result<T>>;

export type HttpClient = {
	readonly get: HttpGet;
	readonly post: HttpPost;
	readonly put: HttpPut;
	readonly delete: HttpDelete;
};

// Logger function types
export type LogDebug = (
	message: string,
	meta?: Record<string, unknown>,
) => void;
export type LogInfo = (message: string, meta?: Record<string, unknown>) => void;
export type LogWarn = (message: string, meta?: Record<string, unknown>) => void;
export type LogError = (
	message: string,
	error?: Error,
	meta?: Record<string, unknown>,
) => void;

export type Logger = {
	readonly debug: LogDebug;
	readonly info: LogInfo;
	readonly warn: LogWarn;
	readonly error: LogError;
};

// ID Generator function types
export type GenerateId = () => string;

export type IdGenerator = {
	readonly generate: GenerateId;
};

// Time Provider function types
export type GetCurrentTime = () => number;

export type TimeProvider = {
	readonly now: GetCurrentTime;
};

// Funnel Repository function types
export type SaveFunnel = (funnel: Funnel) => Promise<Result<Funnel>>;
export type FindFunnelById = (id: string) => Promise<Result<Funnel | null>>;
export type FindFunnelsByDateRange = (
	start: number,
	end: number,
) => Promise<Result<readonly Funnel[]>>;

export type FunnelRepository = {
	readonly save: SaveFunnel;
	readonly findById: FindFunnelById;
	readonly findByDateRange: FindFunnelsByDateRange;
};

// Retention Repository function types
export type SaveRetentionData = (
	data: RetentionData,
) => Promise<Result<RetentionData>>;
export type FindRetentionByCohort = (
	cohort: string,
) => Promise<Result<RetentionData | null>>;
export type FindRetentionByDateRange = (
	start: number,
	end: number,
) => Promise<Result<readonly RetentionData[]>>;

export type RetentionRepository = {
	readonly save: SaveRetentionData;
	readonly findByCohort: FindRetentionByCohort;
	readonly findByDateRange: FindRetentionByDateRange;
};
