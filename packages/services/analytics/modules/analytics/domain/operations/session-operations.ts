/**
 * Session Domain Operations
 * Pure functions for session business logic
 */

import {
	validateSessionId,
	validateUserId,
	validateUTMParameters,
} from "#analytics/modules/analytics/domain/validators/index";
import type {
	Result,
	Session,
	SessionId,
	Timestamp,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

export const createSession = (
	data: Readonly<{
		id: SessionId;
		userId?: UserId;
		startTime: Timestamp;
		device?: string;
		browser?: string;
		os?: string;
		country?: string;
		referrer?: string;
		utmParameters?: UTMParameters;
	}>,
): Result<Session> => {
	// Validate inputs using validators
	const sessionIdResult = validateSessionId(data.id);
	if (isErr(sessionIdResult)) {
		return err(sessionIdResult.error);
	}

	const userIdResult = data.userId
		? validateUserId(data.userId)
		: ok(undefined);
	if (isErr(userIdResult)) {
		return err(userIdResult.error);
	}

	const utmResult = validateUTMParameters(data.utmParameters);
	if (isErr(utmResult)) {
		return err(utmResult.error);
	}

	return ok({
		id: data.id,
		...(data.userId !== undefined && { userId: data.userId }),
		startTime: data.startTime,
		pageViews: 0,
		events: 0,
		duration: 0,
		...(data.device !== undefined && { device: data.device }),
		...(data.browser !== undefined && { browser: data.browser }),
		...(data.os !== undefined && { os: data.os }),
		...(data.country !== undefined && { country: data.country }),
		...(data.referrer !== undefined && { referrer: data.referrer }),
		...(data.utmParameters !== undefined && {
			utmParameters: data.utmParameters,
		}),
	} as Session);
};

export const endSession = (session: Session, endTime: Timestamp): Session => ({
	...session,
	endTime,
	duration: endTime - session.startTime,
});

export const incrementPageViews = (session: Session): Session => ({
	...session,
	pageViews: (session.pageViews ?? 0) + 1,
});

export const incrementEvents = (session: Session): Session => ({
	...session,
	events: (session.events ?? 0) + 1,
});

export const isSessionActive = (
	session: Session,
	currentTime: Timestamp,
	maxDuration: number = 30 * 60 * 1000,
): boolean => {
	const sessionEnd = session.endTime || currentTime;
	return sessionEnd - session.startTime < maxDuration;
};

export const getSessionDuration = (
	session: Session,
	currentTime: Timestamp,
): number => {
	const endTime = session.endTime || currentTime;
	return endTime - session.startTime;
};
export const sessionToObject = (session: Session): Record<string, unknown> => ({
	id: session.id,
	userId: session.userId,
	startTime: session.startTime,
	endTime: session.endTime,
	pageViews: session.pageViews,
	events: session.events,
	duration: session.duration,
	device: session.device,
	browser: session.browser,
	os: session.os,
	country: session.country,
	referrer: session.referrer,
	utmParameters: session.utmParameters,
});

export const sessionFromData = (
	data: Record<string, unknown>,
): Result<Session> => {
	const sessionIdResult = validateSessionId(data.id as SessionId);
	if (isErr(sessionIdResult)) {
		return err(sessionIdResult.error);
	}

	const userIdResult = data.userId
		? validateUserId(data.userId as UserId)
		: ok(undefined);
	if (isErr(userIdResult)) {
		return err(userIdResult.error);
	}

	const utmResult = validateUTMParameters(
		data.utmParameters as UTMParameters | undefined,
	);
	if (isErr(utmResult)) {
		return err(utmResult.error);
	}

	return ok({
		id: data.id as SessionId,
		...(data.userId !== undefined && { userId: data.userId as UserId }),
		startTime: data.startTime as Timestamp,
		...(data.endTime !== undefined && { endTime: data.endTime as Timestamp }),
		...((data.pageViews as number) !== undefined && {
			pageViews: data.pageViews as number,
		}),
		...((data.events as number) !== undefined && {
			events: data.events as number,
		}),
		...((data.duration as number) !== undefined && {
			duration: data.duration as number,
		}),
		...(data.device !== undefined && { device: data.device as string }),
		...(data.browser !== undefined && { browser: data.browser as string }),
		...(data.os !== undefined && { os: data.os as string }),
		...(data.country !== undefined && { country: data.country as string }),
		...(data.referrer !== undefined && { referrer: data.referrer as string }),
		...(data.utmParameters !== undefined && {
			utmParameters: data.utmParameters as UTMParameters,
		}),
	});
};
