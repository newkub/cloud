/**
 * ID Generator Adapter
 * Provides UUID generation functionality
 */

import type { IdGenerator } from "#analytics/modules/analytics/ports";

export const createIdGenerator = (): IdGenerator => ({
	generate: (
		randomUUID: () => string = (
			randomUUID: () => string = () => crypto.randomUUID(),
		) => randomUUID(),
	): string => randomUUID(),
});

export const idGenerator = createIdGenerator();
