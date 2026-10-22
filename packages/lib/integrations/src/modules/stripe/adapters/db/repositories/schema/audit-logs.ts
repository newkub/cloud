// ============================================================================
// Infrastructure - Database Schema - Audit Logs
// ============================================================================

import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
	id: serial("id").primaryKey(),
	entityType: varchar("entity_type", { length: 50 }).notNull(),
	entityId: varchar("entity_id", { length: 255 }).notNull(),
	action: varchar("action", { length: 50 }).notNull(),
	changes: text("changes"),
	performedBy: varchar("performed_by", { length: 255 }),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
