// Analytics User Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type {
	EventProperties,
	Result,
	User,
	UserId,
} from "#analytics/modules/analytics/types";
import { err, isErr, ok, unwrapErr } from "#analytics/shared/utils/result";

/**
 * User ID Schema
 */
export const userIdSchema = type("string >= 1");

export type UserIdSchema = typeof userIdSchema.infer;

/**
 * Email Schema
 */
export const emailSchema = type("string.email");

export type EmailSchema = typeof emailSchema.infer;

/**
 * User Name Schema
 */
export const userNameSchema = type("string >= 1").narrow(
	(name) => name.length <= 255,
);

export type UserNameSchema = typeof userNameSchema.infer;

/**
 * User Properties Schema
 */
export const userPropertiesSchema = type("object");

export type UserPropertiesSchema = typeof userPropertiesSchema.infer;

/**
 * User Schema
 */
export const userSchema = type({
	id: userIdSchema,
	"email?": emailSchema,
	"name?": userNameSchema,
	"properties?": userPropertiesSchema,
	firstSeen: "number > 0",
	lastSeen: "number > 0",
	totalSessions: "number >= 0",
	totalEvents: "number >= 0",
	totalPageViews: "number >= 0",
}).narrow((user) => user.lastSeen >= user.firstSeen);

export type UserSchema = typeof userSchema.infer;

/**
 * Validate user ID using Arktype
 */
export const validateUserId = (userId: unknown): Result<UserId> => {
	const result = userIdSchema(userId);
	if (result instanceof type.errors) {
		return err(new Error("User ID is required and must be a string"));
	}
	return ok(result as UserId);
};

/**
 * Validate email using Arktype
 */
export const validateEmail = (email?: unknown): Result<string | undefined> => {
	if (email === undefined) {
		return ok(undefined);
	}

	const result = emailSchema(email);
	if (result instanceof type.errors) {
		return err(new Error("Invalid email format"));
	}
	return ok(result);
};

/**
 * Validate user name using Arktype
 */
export const validateUserName = (
	name?: unknown,
): Result<string | undefined> => {
	if (name === undefined) {
		return ok(undefined);
	}

	const result = userNameSchema(name);
	if (result instanceof type.errors) {
		return err(
			new Error("User name must be a non-empty string <= 255 characters"),
		);
	}
	return ok(result);
};

/**
 * Validate user properties using Arktype
 */
export const validateUserProperties = (
	properties?: unknown,
): Result<EventProperties> => {
	if (properties === undefined) {
		return ok({});
	}

	const result = userPropertiesSchema(properties);
	if (result instanceof type.errors) {
		return err(new Error("User properties must be an object"));
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
		return err(new Error("User properties cannot contain circular references"));
	}

	return ok(result as EventProperties);
};

/**
 * Validate user using Arktype
 */
export const validateUser = (user: unknown): Result<User> => {
	const result = userSchema(user);
	if (result instanceof type.errors) {
		return err(new Error(result.summary));
	}

	const userData = result as User;

	// Validate individual fields
	const userIdResult = validateUserId(userData.id);
	if (isErr(userIdResult)) {
		return err(unwrapErr(userIdResult));
	}

	const emailResult = validateEmail(userData.email);
	if (isErr(emailResult)) {
		return err(unwrapErr(emailResult));
	}

	const nameResult = validateUserName(userData.name);
	if (isErr(nameResult)) {
		return err(unwrapErr(nameResult));
	}

	const propertiesResult = validateUserProperties(userData.properties);
	if (isErr(propertiesResult)) {
		return err(unwrapErr(propertiesResult));
	}

	return ok(userData);
};
