// ============================================================================
// Adapters - External - Audit Log Adapter
// ============================================================================

import type { AuditLogAdapter } from "#modules/subscription/ports/subscription-repository";
import type {
	MemberSubscription,
	SubscriptionPlan,
} from "#modules/subscription/types";

export class ConsoleAuditLogAdapter implements AuditLogAdapter {
	async logPlanCreated(
		plan: SubscriptionPlan,
		createdBy: string,
		now: number = Date.now(),
	): Promise<void> {
		console.log(
			`[AUDIT] Plan created: ${plan.id} by ${createdBy} at ${new Date(now).toISOString()}`,
		);
	}

	async logPlanUpdated(
		planId: string,
		changes: Partial<SubscriptionPlan>,
		updatedBy: string,
		now: number = Date.now(),
	): Promise<void> {
		console.log(
			`[AUDIT] Plan updated: ${planId} by ${updatedBy} at ${new Date(now).toISOString()}. Changes: ${JSON.stringify(changes)}`,
		);
	}

	async logPlanDeleted(
		planId: string,
		deletedBy: string,
		now: number = Date.now(),
	): Promise<void> {
		console.log(
			`[AUDIT] Plan deleted: ${planId} by ${deletedBy} at ${new Date(now).toISOString()}`,
		);
	}

	async logSubscriptionCreated(
		subscription: MemberSubscription,
		createdBy: string,
		now: number = Date.now(),
	): Promise<void> {
		console.log(
			`[AUDIT] Subscription created: ${subscription.id} by ${createdBy} at ${new Date(now).toISOString()}`,
		);
	}

	async logSubscriptionCancelled(
		subscription: MemberSubscription,
		reason?: string,
		cancelledBy?: string,
		now: number = Date.now(),
	): Promise<void> {
		console.log(
			`[AUDIT] Subscription cancelled: ${subscription.id} by ${cancelledBy || "system"} at ${new Date(now).toISOString()}. Reason: ${reason || "Not specified"}`,
		);
	}
}
