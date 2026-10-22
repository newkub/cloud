// Identify user action

import type { UserRepository } from "#analytics/modules/analytics/ports";
import type { User } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createIdentifyUserAction = (
	userRepository: UserRepository,
	state: AnalyticsState & AnalyticsStateMutators,
) => {
	return async (
		user: Omit<User, "id" | "firstSeen" | "lastSeen">,
		now2: number = Date.now(),
		randomUUID: () => string = (
			randomUUID: () => string = () => crypto.randomUUID(),
		) => randomUUID(),
	) => {
		try {
			const now = now2;
			const newUser: User = {
				...user,
				id: randomUUID(),
				firstSeen: now,
				lastSeen: now,
				totalSessions: 0,
				totalEvents: 0,
				totalPageViews: 0,
			};

			await userRepository.save(newUser);

			state.setData({
				...state.data(),
				users: [newUser, ...state.data().users],
			});
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to identify user",
			);
		}
	};
};
