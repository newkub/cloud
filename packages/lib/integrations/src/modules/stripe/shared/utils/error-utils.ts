// ============================================================================
// Shared Kernel - Error Handling Utilities
// ============================================================================

export const withFallback = <T>(fn: () => T, fallback: T): T => {
	try {
		return fn();
	} catch {
		return fallback;
	}
};

export const withTimeout = <T>(
	promise: Promise<T>,
	timeoutMs: number,
	timeoutError: Error = new Error("Operation timed out"),
): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(timeoutError), timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]);
};

export const retry = <T>(
	fn: () => Promise<T>,
	maxAttempts: number = 3,
	delayMs: number = 1000,
): Promise<T> => {
	const attempt = async (attemptNumber: number): Promise<T> => {
		try {
			return await fn();
		} catch (error) {
			if (attemptNumber >= maxAttempts) {
				throw error;
			}

			await new Promise((resolve) => setTimeout(resolve, delayMs));
			return attempt(attemptNumber + 1);
		}
	};

	return attempt(1);
};
