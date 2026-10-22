// Analytics Event Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type {
	Event,
	EventProperties,
	EventType,
	Result,
	SessionId,
	UserId,
} from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

/**
 * Event Type Schema
 */
export const eventTypeSchema = type(
	"'page_view' | 'track' | 'identify' | 'revenue' | 'web_vital' | 'custom'",
);

export type EventTypeSchema = typeof eventTypeSchema.infer;

/**
 * Session ID Schema
 */
export const sessionIdSchema = type("string >= 1");

export type SessionIdSchema = typeof sessionIdSchema.infer;

/**
 * User ID Schema
 */
export const userIdSchema = type("string >= 1");

export type UserIdSchema = typeof userIdSchema.infer;

/**
 * Event Properties Schema
 */
export const eventPropertiesSchema = type("object");

export type EventPropertiesSchema = typeof eventPropertiesSchema.infer;

/**
 * Validate event name using Arktype
 */
export const validateEventName = (name: unknown): Result<EventType> => {
	const result = eventTypeSchema(name);
	if (result instanceof type.errors) {
		return err(new Error(`Invalid event type: ${result.summary}`));
	}
	return ok(result as EventType);
};

/**
 * Validate session ID using Arktype
 */
export const validateSessionId = (sessionId: unknown): Result<SessionId> => {
	const result = sessionIdSchema(sessionId);
	if (result instanceof type.errors) {
		return err(new Error("Session ID is required and must be a string"));
	}
	return ok(result as SessionId);
};

/**
 * Validate event user ID using Arktype
 */
export const validateEventUserId = (
	userId?: unknown,
): Result<UserId | undefined> => {
	if (userId === undefined) {
		return ok(undefined);
	}

	const result = userIdSchema(userId);
	if (result instanceof type.errors) {
		return err(new Error("User ID must be a string"));
	}
	return ok(result as UserId);
};

/**
 * Validate event properties using Arktype
 */
export const validateEventProperties = (
	properties?: unknown,
): Result<EventProperties> => {
	if (properties === undefined) {
		return ok({});
	}

	const result = eventPropertiesSchema(properties);
	if (result instanceof type.errors) {
		return err(new Error("Event properties must be an object"));
	}

	// Check for circular references
	const seen = new WeakSet();
	const hasCircularRef = (obj: Record<string, unknown>): boolean => {
		if (typeof obj !== "object" || obj === null) return false;
		if (seen.has(obj)) return true;
		seen.add(obj);
		return Object.values(obj).some((val) =>
			typeof val === "object" && val !== null
				? hasCircularRef(val as Record<string, unknown>)
				: false,
		);
	};

	if (hasCircularRef(result as Record<string, unknown>)) {
		return err(
			new Error("Event properties cannot contain circular references"),
		);
	}

	return ok(result as EventProperties);
};

/**
 * Validate event using Arktype
 */
export const validateEvent = (event: unknown): Result<Event> => {
	if (typeof event !== "object" || event === null) {
		return err(new Error("Event must be an object"));
	}

	const eventData = event as Partial<Event>;

	const nameResult = validateEventName(eventData.name);
	if (isErr(nameResult)) {
		return err(nameResult.error);
	}

	const sessionIdResult = validateSessionId(eventData.sessionId);
	if (isErr(sessionIdResult)) {
		return err(sessionIdResult.error);
	}

	const userIdResult = validateEventUserId(eventData.userId);
	if (isErr(userIdResult)) {
		return err(userIdResult.error);
	}

	const propertiesResult = validateEventProperties(eventData.properties);
	if (isErr(propertiesResult)) {
		return err(propertiesResult.error);
	}

	return ok(eventData as Event);
};
