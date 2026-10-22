import {
	integer,
	jsonb,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const sessions = pgTable("analytics_sessions", {
	id: serial("id").primaryKey(),
	sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
	userId: varchar("user_id", { length: 100 }),
	startTime: timestamp("start_time", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	endTime: timestamp("end_time", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	}),
	duration: integer("duration"),
	pageViews: integer("page_views").default(0),
	properties: jsonb("properties"),
	createdAt: timestamp("created_at", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
});
