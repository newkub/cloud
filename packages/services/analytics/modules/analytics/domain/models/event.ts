/**
 * Event Domain Model
 * Analytics event domain type
 */

import type {
	EventId,
	EventProperties,
	EventType,
	SessionId,
	Timestamp,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";

export type Event = Readonly<{
	id: EventId;
	name: EventType;
	properties: EventProperties;
	sessionId: SessionId;
	userId?: UserId;
	timestamp: Timestamp;
	utmParameters?: UTMParameters;
}>;
