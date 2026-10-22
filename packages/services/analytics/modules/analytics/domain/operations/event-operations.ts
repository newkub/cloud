/**
 * Event Domain Operations
 * Pure functions for event business logic
 */

import type { Event } from "#analytics/modules/analytics/domain/models";
import {
	validateEventName,
	validateEventProperties,
	validateSessionId,
	validateUserId,
} from "#analytics/modules/analytics/domain/validators/index";
import type {
	EventProperties,
	EventType,
	Result,
	SessionId,
	Timestamp,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

export const createEvent = (
	data: Readonly<{
		id: string;
		name: EventType;
		properties?: EventProperties;
		sessionId: SessionId;
		userId?: UserId;
		timestamp: Timestamp;
		utmParameters?: UTMParameters;
	}>,
): Result<Event> => {
	// Validate inputs using validators
	const nameResult = validateEventName(data.name);
	if (isErr(nameResult)) {
		return err(nameResult.error);
	}

	const sessionIdResult = validateSessionId(data.sessionId);
	if (isErr(sessionIdResult)) {
		return err(sessionIdResult.error);
	}

	const userIdResult = data.userId
		? validateUserId(data.userId)
		: ok(undefined);
	if (isErr(userIdResult)) {
		return err(userIdResult.error);
	}

	const propertiesResult = validateEventProperties(data.properties);
	if (isErr(propertiesResult)) {
		return err(propertiesResult.error);
	}

	const properties = data.properties || {};

	return ok({
		id: data.id,
		name: data.name,
		properties,
		sessionId: data.sessionId,
		...(data.userId !== undefined && { userId: data.userId }),
		timestamp: data.timestamp,
		...(data.utmParameters !== undefined && {
			utmParameters: data.utmParameters,
		}),
	});
};

export const createPageView = (
	data: Readonly<{
		path: string;
		title?: string;
		referrer?: string;
		sessionId: SessionId;
		userId?: UserId;
		utmParameters?: UTMParameters;
		id?: string;
		timestamp: Timestamp;
	}>,
): Result<Event> => {
	if (!data.path || typeof data.path !== "string") {
		return err(new Error("Path is required for page view"));
	}

	return createEvent({
		id: data.id || "",
		name: "page_view" as EventType,
		properties: {
			path: data.path,
			...(data.title !== undefined && { title: data.title }),
			...(data.referrer !== undefined && { referrer: data.referrer }),
			...(data.utmParameters ? utmParametersToObject(data.utmParameters) : {}),
		},
		sessionId: data.sessionId,
		...(data.userId !== undefined && { userId: data.userId }),
		timestamp: data.timestamp,
		...(data.utmParameters !== undefined && {
			utmParameters: data.utmParameters,
		}),
	});
};

export const createIdentify = (
	data: Readonly<{
		userId: UserId;
		email?: string;
		name?: string;
		properties?: EventProperties;
		sessionId: SessionId;
		id?: string;
		timestamp: Timestamp;
	}>,
): Result<Event> => {
	if (!data.userId) {
		return err(new Error("User ID is required for identify"));
	}

	return createEvent({
		id: data.id || "",
		name: "identify" as EventType,
		properties: {
			id: data.userId,
			email: data.email,
			name: data.name,
			...data.properties,
		},
		sessionId: data.sessionId,
		userId: data.userId,
		timestamp: data.timestamp,
	});
};

export const createRevenue = (
	data: Readonly<{
		amount: number;
		currency?: string;
		product?: string;
		orderId?: string;
		properties?: EventProperties;
		sessionId: SessionId;
		userId?: UserId;
		id?: string;
		timestamp: Timestamp;
	}>,
): Result<Event> => {
	if (typeof data.amount !== "number" || data.amount <= 0) {
		return err(new Error("Revenue amount must be a positive number"));
	}

	return createEvent({
		id: data.id || "",
		name: "revenue" as EventType,
		properties: {
			amount: data.amount,
			currency: data.currency || "USD",
			...(data.product !== undefined && { product: data.product }),
			...(data.orderId !== undefined && { orderId: data.orderId }),
			...data.properties,
		},
		sessionId: data.sessionId,
		...(data.userId !== undefined && { userId: data.userId }),
		timestamp: data.timestamp,
	});
};

export const withProperties = (
	event: Event,
	properties: EventProperties,
): Event => ({
	...event,
	properties: { ...event.properties, ...properties },
});

export const utmParametersToObject = (utm: UTMParameters): EventProperties => ({
	utm_source: utm.source,
	utm_medium: utm.medium,
	utm_campaign: utm.campaign,
	utm_term: utm.term,
	utm_content: utm.content,
});

export const eventToObject = (event: Event): Record<string, unknown> => ({
	id: event.id,
	name: event.name,
	properties: event.properties,
	sessionId: event.sessionId,
	userId: event.userId,
	timestamp: event.timestamp,
	utmParameters: event.utmParameters
		? utmParametersToObject(event.utmParameters)
		: undefined,
});

export const eventToJSON = (event: Event): string =>
	JSON.stringify(eventToObject(event));
