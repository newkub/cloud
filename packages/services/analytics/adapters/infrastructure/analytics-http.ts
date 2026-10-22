/**
 * Analytics HTTP Adapter
 * Infrastructure layer for sending analytics events
 */

/**
 * Send events to analytics endpoint
 * @param endpoint - Analytics API endpoint
 * @param apiKey - API key for authentication
 * @param events - Array of events to send
 * @param debug - Enable debug logging
 * @returns Promise that resolves when events are sent
 */
export const sendEventsToEndpoint = async (
	endpoint: string,
	apiKey: string,
	events: Array<{ type: string; data: Record<string, unknown> }>,
	debug: boolean,
): Promise<void> => {
	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({ events }),
		});

		if (!response.ok && debug) {
			// Failed to send events - silent in production
		}
	} catch (_error) {
		if (debug) {
			// Error sending events - silent in production
		}
	}
};
