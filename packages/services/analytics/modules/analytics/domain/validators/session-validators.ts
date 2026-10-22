// Analytics Session Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type {
	Result,
	Session,
	SessionId,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

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
 * UTM Parameters Schema
 */
export const utmParametersSchema = type({
	"source?": "string >= 1",
	"medium?": "string >= 1",
	"campaign?": "string >= 1",
	"term?": "string >= 1",
	"content?": "string >= 1",
});

export type UTMParametersSchema = typeof utmParametersSchema.infer;

/**
 * Session Schema
 */
export const sessionSchema = type({
	id: sessionIdSchema,
	"userId?": userIdSchema,
	startTime: "number > 0",
	pageViews: "number >= 0",
	events: "number >= 0",
	duration: "number >= 0",
	"endTime?": "number > 0",
});

export type SessionSchema = typeof sessionSchema.infer;

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
 * Validate session user ID using Arktype
 */
export const validateSessionUserId = (
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
 * Validate UTM parameters using Arktype
 */
export const validateUTMParameters = (
	utm?: unknown,
): Result<UTMParameters | undefined> => {
	if (utm === undefined) {
		return ok(undefined);
	}

	const result = utmParametersSchema(utm);
	if (result instanceof type.errors) {
		return err(new Error("UTM parameters must be a valid object"));
	}
	return ok(result as UTMParameters);
};

/**
 * Validate session using Arktype
 */
export const validateSession = (session: unknown): Result<Session> => {
	const result = sessionSchema(session);
	if (result instanceof type.errors) {
		return err(new Error(result.summary));
	}

	const sessionData = result as Session;

	// Check if end time is after start time
	if (sessionData.endTime !== undefined) {
		if (sessionData.endTime < sessionData.startTime) {
			return err(new Error("Session end time cannot be before start time"));
		}
	}

	return ok(sessionData);
};
