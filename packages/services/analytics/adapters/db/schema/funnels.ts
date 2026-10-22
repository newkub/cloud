import {
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const funnels = pgTable("analytics_funnels", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	steps: jsonb("steps").notNull(),
	config: jsonb("config"),
	createdAt: timestamp("created_at", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		mode: "date",
		precision: 3,
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
});
