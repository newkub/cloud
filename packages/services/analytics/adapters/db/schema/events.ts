import {
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const events = pgTable("analytics_events", {
	id: serial("id").primaryKey(),
	sessionId: varchar("session_id", { length: 100 }).notNull(),
	eventName: varchar("event_name", { length: 255 }).notNull(),
	properties: jsonb("properties"),
	timestamp: timestamp("timestamp", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	userId: varchar("user_id", { length: 100 }),
	pageUrl: text("page_url"),
	referrer: text("referrer"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
});
