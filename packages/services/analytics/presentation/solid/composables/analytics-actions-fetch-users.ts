// Fetch users action

import type { UserRepository } from "#analytics/modules/analytics/ports";
import type { User } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createFetchUsersAction = (
	userRepository: UserRepository,
	state: AnalyticsState & AnalyticsStateMutators,
) => {
	return async (page = 1) => {
		state.setLoading(true);
		state.setError(null);

		try {
			// Fetch active users (last 30 days)
			const result = await userRepository.findActiveUsers(30);
			let users: readonly User[] = [];

			if (result.success && result.data) {
				users = result.data;
			}

			// Apply pagination
			const offset = (page - 1) * 50;
			const paginatedUsers = users.slice(offset, offset + 50);

			state.setData({
				...state.data(),
				users: paginatedUsers,
			});
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to fetch users",
			);
		} finally {
			state.setLoading(false);
		}
	};
};
