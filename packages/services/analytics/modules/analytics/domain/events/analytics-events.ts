/**
 * Analytics Domain Events
 * Domain event types for analytics module
 */

import type {
	EventId,
	SessionId,
	UserId,
} from "#analytics/modules/analytics/types";

export type EventCreated = Readonly<{
	type: "EventCreated";
	data: Readonly<{
		eventId: EventId;
		sessionId: SessionId;
		userId?: UserId;
		timestamp: number;
	}>;
}>;

export type SessionStarted = Readonly<{
	type: "SessionStarted";
	data: Readonly<{
		sessionId: SessionId;
		userId?: UserId;
		timestamp: number;
	}>;
}>;

export type SessionEnded = Readonly<{
	type: "SessionEnded";
	data: Readonly<{
		sessionId: SessionId;
		userId?: UserId;
		duration: number;
		timestamp: number;
	}>;
}>;

export type UserIdentified = Readonly<{
	type: "UserIdentified";
	data: Readonly<{
		userId: UserId;
		sessionId: SessionId;
		timestamp: number;
	}>;
}>;

export type AnalyticsDomainEvent =
	| EventCreated
	| SessionStarted
	| SessionEnded
	| UserIdentified;

export const createEventCreated = (
	eventId: EventId,
	sessionId: SessionId,
	timestamp: number,
	userId?: UserId,
): EventCreated => ({
	type: "EventCreated",
	data: {
		eventId,
		sessionId,
		...(userId !== undefined && { userId }),
		timestamp,
	},
});

export const createSessionStarted = (
	sessionId: SessionId,
	timestamp: number,
	userId?: UserId,
): SessionStarted => ({
	type: "SessionStarted",
	data: { sessionId, ...(userId !== undefined && { userId }), timestamp },
});

export const createSessionEnded = (
	sessionId: SessionId,
	duration: number,
	timestamp: number,
	userId?: UserId,
): SessionEnded => ({
	type: "SessionEnded",
	data: {
		sessionId,
		...(userId !== undefined && { userId }),
		duration,
		timestamp,
	},
});

export const createUserIdentified = (
	userId: UserId,
	sessionId: SessionId,
	timestamp: number,
): UserIdentified => ({
	type: "UserIdentified",
	data: { userId, sessionId, timestamp },
});
