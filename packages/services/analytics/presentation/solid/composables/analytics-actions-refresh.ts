// Refresh action

export const createRefreshAction = (
	fetchEvents: () => Promise<void>,
	fetchSessions: () => Promise<void>,
	fetchUsers: () => Promise<void>,
	fetchWebVitals: () => Promise<void>,
) => {
	return async () => {
		await Promise.all([
			fetchEvents(),
			fetchSessions(),
			fetchUsers(),
			fetchWebVitals(),
		]);
	};
};
