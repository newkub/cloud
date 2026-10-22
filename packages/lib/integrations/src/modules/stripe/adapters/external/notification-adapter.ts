// ============================================================================
// Adapters - External - Notification Service Adapter
// ============================================================================

import type { NotificationServiceAdapter } from "#modules/subscription/ports/subscription-repository";
import type { MemberSubscription } from "#modules/subscription/types";

export class ConsoleNotificationAdapter implements NotificationServiceAdapter {
	async sendSubscriptionConfirmation(
		subscription: MemberSubscription,
	): Promise<void> {
		console.log(
			`[NOTIFICATION] Subscription confirmation sent to customer ${subscription.customerId} for plan ${subscription.planId}`,
		);
	}

	async sendSubscriptionCancellation(
		subscription: MemberSubscription,
		reason?: string,
	): Promise<void> {
		console.log(
			`[NOTIFICATION] Subscription cancellation sent to customer ${subscription.customerId} for plan ${subscription.planId}. Reason: ${reason || "Not specified"}`,
		);
	}

	async sendPaymentFailed(subscription: MemberSubscription): Promise<void> {
		console.log(
			`[NOTIFICATION] Payment failed notification sent to customer ${subscription.customerId} for subscription ${subscription.stripeSubscriptionId}`,
		);
	}

	async sendTrialEnding(subscription: MemberSubscription): Promise<void> {
		console.log(
			`[NOTIFICATION] Trial ending notification sent to customer ${subscription.customerId} for subscription ${subscription.stripeSubscriptionId}`,
		);
	}
}
