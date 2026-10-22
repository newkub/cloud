/**
 * Session Domain Model
 * Analytics session domain type
 */

import type {
	SessionId,
	Timestamp,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";

export type Session = Readonly<{
	id: SessionId;
	userId?: UserId;
	startTime: Timestamp;
	endTime?: Timestamp;
	utmParameters?: UTMParameters;
	pageViews?: number;
	events?: number;
	duration?: number;
	device?: string;
	browser?: string;
	os?: string;
	country?: string;
	referrer?: string;
}>;
