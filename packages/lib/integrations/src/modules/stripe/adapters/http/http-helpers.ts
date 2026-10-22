// ============================================================================
// Subscription Module - HTTP Helper Functions
// ============================================================================

const BASE_URL = "/api/dashboard/subscriptions";

export const makeRequest = async <T>(
	url: string,
	options: RequestInit = {},
): Promise<T> => {
	const response = await fetch(url, {
		headers: { "Content-Type": "application/json", ...options.headers },
		...options,
	});

	if (!response.ok) {
		throw new Error(`Request failed: ${response.statusText}`);
	}

	return response.json();
};

export const makeRequestWithOptional404 = async <T>(
	url: string,
	options: RequestInit = {},
): Promise<T | null> => {
	try {
		const response = await fetch(url, {
			headers: { "Content-Type": "application/json", ...options.headers },
			...options,
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(`Request failed: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		if (error instanceof Error && error.message.includes("404")) {
			return null;
		}
		throw error;
	}
};

export const buildUrl = (
	path: string,
	params?: Record<string, string | number | boolean | undefined>,
): string => {
	const url = new URL(
		`${BASE_URL}${path}`,
		typeof window !== "undefined" ? window.location.origin : "http://localhost",
	);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, String(value));
			}
		});
	}

	return url.toString();
};
