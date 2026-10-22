/**
 * Event Repository Implementation
 * Database adapter for event persistence
 */

import type {
	EventFilters,
	EventRepository as IEventRepository,
} from "#analytics/modules/analytics/ports";
import type { Event, Result } from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export interface Database {
	query(text: string, params?: unknown[]): Promise<{ rows: unknown[] }>;
}

// Event repository factory function
export const createEventRepository = (db: Database): IEventRepository => ({
	save: async (event: Event): Promise<Result<Event>> => {
		try {
			const query = `
        INSERT INTO events (
          id, name, properties, session_id, user_id, timestamp, utm_parameters
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          properties = EXCLUDED.properties,
          session_id = EXCLUDED.session_id,
          user_id = EXCLUDED.user_id,
          timestamp = EXCLUDED.timestamp,
          utm_parameters = EXCLUDED.utm_parameters
        RETURNING *
      `;

			const values = [
				event.id,
				event.name,
				JSON.stringify(event.properties),
				event.sessionId,
				event.userId,
				event.timestamp,
				JSON.stringify(event.utmParameters),
			];

			const result = await db.query(query, values);
			return ok(result.rows[0] as Event);
		} catch (_error) {
			return err(new Error("Failed to save event"));
		}
	},

	findById: async (id: string): Promise<Result<Event | null>> => {
		try {
			const query = "SELECT * FROM events WHERE id = $1";
			const result = await db.query(query, [id]);
			return ok((result.rows[0] as Event) || null);
		} catch (_error) {
			return err(new Error("Failed to find event by id"));
		}
	},

	findBySessionId: async (
		sessionId: string,
	): Promise<Result<readonly Event[]>> => {
		try {
			const query =
				"SELECT * FROM events WHERE session_id = $1 ORDER BY timestamp ASC";
			const result = await db.query(query, [sessionId]);
			return ok(result.rows as readonly Event[]);
		} catch (_error) {
			return err(new Error("Failed to find events by session id"));
		}
	},

	findByUserId: async (userId: string): Promise<Result<readonly Event[]>> => {
		try {
			const query =
				"SELECT * FROM events WHERE user_id = $1 ORDER BY timestamp DESC";
			const result = await db.query(query, [userId]);
			return ok(result.rows as readonly Event[]);
		} catch (_error) {
			return err(new Error("Failed to find events by user id"));
		}
	},

	findByDateRange: async (
		start: number,
		end: number,
		filters?: EventFilters,
	): Promise<Result<readonly Event[]>> => {
		try {
			let query = "SELECT * FROM events WHERE timestamp BETWEEN $1 AND $2";
			const values: (string | number | readonly string[])[] = [start, end];
			let paramIndex = 3;

			if (filters?.userId) {
				query += ` AND user_id = $${paramIndex}`;
				values.push(filters.userId);
				paramIndex++;
			}

			if (filters?.eventTypes?.length) {
				const placeholders = filters.eventTypes
					.map((_: string, i: number) => `$${paramIndex + i}`)
					.join(", ");
				query += ` AND name IN (${placeholders})`;
				values.push(filters.eventTypes);
				paramIndex += filters.eventTypes.length;
			}

			query += " ORDER BY timestamp DESC";

			const result = await db.query(query, values);
			return ok(result.rows as readonly Event[]);
		} catch (_error) {
			return err(new Error("Failed to find events by date range"));
		}
	},

	findByEventNames: async (
		names: readonly string[],
		filters?: EventFilters,
	): Promise<Result<readonly Event[]>> => {
		try {
			let query = "SELECT * FROM events WHERE name = ANY($1)";
			const values: (string | number | readonly string[])[] = [names];
			let paramIndex = 2;

			if (filters?.userId) {
				query += ` AND user_id = $${paramIndex}`;
				values.push(filters.userId);
				paramIndex++;
			}

			if (filters?.dateRange) {
				query += ` AND timestamp BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
				values.push(filters.dateRange.start, filters.dateRange.end);
				paramIndex += 2;
			}

			query += " ORDER BY timestamp DESC";

			const result = await db.query(query, values);
			return ok(result.rows as readonly Event[]);
		} catch (_error) {
			return err(new Error("Failed to find events by names"));
		}
	},
});
