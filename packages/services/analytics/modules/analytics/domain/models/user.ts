/**
 * User Domain Model
 * Analytics user domain type
 */

import type {
	EventProperties,
	Timestamp,
	UserId,
} from "#analytics/modules/analytics/types";

export type User = Readonly<{
	id: UserId;
	email?: string;
	name?: string;
	properties?: EventProperties;
	firstSeen?: Timestamp;
	lastSeen?: Timestamp;
	totalSessions?: number;
	totalEvents?: number;
	totalPageViews?: number;
}>;
