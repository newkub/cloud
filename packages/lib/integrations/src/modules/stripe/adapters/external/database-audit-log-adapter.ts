// ============================================================================
// Adapters - External - Database Audit Log Adapter (Production)
// ============================================================================

import type { AuditLogAdapter } from "#modules/subscription/ports/subscription-repository";
import type {
	MemberSubscription,
	SubscriptionPlan,
} from "#modules/subscription/types";
import { getDb } from "../../adapters/db/connection";
import { auditLogs } from "../../adapters/db/repositories/schema/audit-logs";

export class DatabaseAuditLogAdapter implements AuditLogAdapter {
	private db: ReturnType<typeof getDb>;

	constructor() {
		this.db = getDb();
	}

	async logPlanCreated(
		plan: SubscriptionPlan,
		createdBy: string,
		now: number = Date.now(),
	): Promise<void> {
		try {
			await this.db.insert(auditLogs).values({
				entityType: "subscription_plan",
				entityId: plan.id,
				action: "created",
				changes: JSON.stringify(plan),
				performedBy: createdBy,
				timestamp: new Date(now),
			});
		} catch (error) {
			console.error("Failed to log plan creation:", error);
		}
	}

	async logPlanUpdated(
		planId: string,
		changes: Partial<SubscriptionPlan>,
		updatedBy: string,
		now: number = Date.now(),
	): Promise<void> {
		try {
			await this.db.insert(auditLogs).values({
				entityType: "subscription_plan",
				entityId: planId,
				action: "updated",
				changes: JSON.stringify(changes),
				performedBy: updatedBy,
				timestamp: new Date(now),
			});
		} catch (error) {
			console.error("Failed to log plan update:", error);
		}
	}

	async logPlanDeleted(
		planId: string,
		deletedBy: string,
		now: number = Date.now(),
	): Promise<void> {
		try {
			await this.db.insert(auditLogs).values({
				entityType: "subscription_plan",
				entityId: planId,
				action: "deleted",
				changes: JSON.stringify({ planId }),
				performedBy: deletedBy,
				timestamp: new Date(now),
			});
		} catch (error) {
			console.error("Failed to log plan deletion:", error);
		}
	}

	async logSubscriptionCreated(
		subscription: MemberSubscription,
		createdBy: string,
		now: number = Date.now(),
	): Promise<void> {
		try {
			await this.db.insert(auditLogs).values({
				entityType: "member_subscription",
				entityId: subscription.id,
				action: "created",
				changes: JSON.stringify(subscription),
				performedBy: createdBy,
				timestamp: new Date(now),
			});
		} catch (error) {
			console.error("Failed to log subscription creation:", error);
		}
	}

	async logSubscriptionCancelled(
		subscription: MemberSubscription,
		reason?: string,
		cancelledBy?: string,
		now: number = Date.now(),
	): Promise<void> {
		try {
			await this.db.insert(auditLogs).values({
				entityType: "member_subscription",
				entityId: subscription.id,
				action: "cancelled",
				changes: JSON.stringify({
					subscription,
					reason,
					cancelledBy,
				}),
				performedBy: cancelledBy || "system",
				timestamp: new Date(now),
			});
		} catch (error) {
			console.error("Failed to log subscription cancellation:", error);
		}
	}
}
