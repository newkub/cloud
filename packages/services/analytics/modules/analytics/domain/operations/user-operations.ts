/**
 * User Domain Operations
 * Pure functions for user business logic
 */

import type {
	EventProperties,
	Result,
	Timestamp,
	User,
	UserId,
} from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export const createUser = (
	data: Readonly<{
		id: UserId;
		email?: string;
		name?: string;
		properties?: EventProperties;
		firstSeen: Timestamp;
	}>,
): Result<User> => {
	if (!data.id) {
		return err(new Error("User ID is required"));
	}

	return ok({
		id: data.id,
		...(data.email !== undefined && { email: data.email }),
		...(data.name !== undefined && { name: data.name }),
		properties: data.properties || {},
		firstSeen: data.firstSeen,
		lastSeen: data.firstSeen,
		totalSessions: 0,
		totalEvents: 0,
		totalPageViews: 0,
	});
};

export const updateUserActivity = (user: User, timestamp: Timestamp): User => ({
	...user,
	lastSeen: timestamp,
});

export const incrementUserSessions = (user: User): User => ({
	...user,
	totalSessions: (user.totalSessions ?? 0) + 1,
});

export const incrementUserEvents = (user: User): User => ({
	...user,
	totalEvents: (user.totalEvents ?? 0) + 1,
});

export const incrementUserPageViews = (user: User): User => ({
	...user,
	totalPageViews: (user.totalPageViews ?? 0) + 1,
});

export const withUserProperties = (
	user: User,
	properties: EventProperties,
): User => ({
	...user,
	properties: { ...user.properties, ...properties },
});

export const isUserActive = (
	user: User,
	currentTime: Timestamp,
	maxInactiveDays: number = 30,
): boolean => {
	if (!user.lastSeen) return false;
	const daysSinceLastSeen =
		(currentTime - user.lastSeen) / (24 * 60 * 60 * 1000);
	return daysSinceLastSeen <= maxInactiveDays;
};

export const userToObject = (user: User): Record<string, unknown> => ({
	id: user.id,
	email: user.email,
	name: user.name,
	properties: user.properties,
	firstSeen: user.firstSeen,
	lastSeen: user.lastSeen,
	totalSessions: user.totalSessions,
	totalEvents: user.totalEvents,
	totalPageViews: user.totalPageViews,
});
