// ============================================================================
// Infrastructure - Database Connection
// ============================================================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb(): ReturnType<typeof drizzle> {
	if (!db) {
		const connectionString =
			process.env.DATABASE_URL || "postgresql://localhost:5432/wrikka_payment";

		if (!connectionString) {
			throw new Error(
				"DATABASE_URL environment variable is not set. Please set it in your .env file.",
			);
		}

		const client = postgres(connectionString, {
			max: 10,
			idle_timeout: 20,
			connect_timeout: 10,
		});

		db = drizzle(client);
	}

	return db;
}

export async function closeDb(): Promise<void> {
	if (db) {
		const client = (db as unknown as { $client: { end: () => Promise<void> } })
			.$client;
		await client.end();
		db = null;
	}
}
