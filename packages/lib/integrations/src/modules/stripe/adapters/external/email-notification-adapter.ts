// ============================================================================
// Adapters - External - Email Notification Service Adapter (Production)
// ============================================================================

import type { NotificationServiceAdapter } from "#modules/subscription/ports/subscription-repository";
import type { MemberSubscription } from "#modules/subscription/types";

export class EmailNotificationAdapter implements NotificationServiceAdapter {
	private apiKey: string;
	private fromEmail: string;
	private apiUrl: string;

	constructor() {
		this.apiKey = process.env.EMAIL_API_KEY || "";
		this.fromEmail = process.env.EMAIL_FROM || "noreply@example.com";
		this.apiUrl =
			process.env.EMAIL_API_URL || "https://api.emailservice.com/v1";

		if (!this.apiKey) {
			console.warn("EMAIL_API_KEY not set - falling back to console logging");
		}
	}

	async sendSubscriptionConfirmation(
		subscription: MemberSubscription,
	): Promise<void> {
		if (!this.apiKey) {
			this.logFallback(subscription, "confirmation");
			return;
		}

		try {
			await this.sendEmail({
				to: subscription.customerId,
				subject: "Subscription Confirmation",
				template: "subscription-confirmation",
				data: {
					subscriptionId: subscription.id,
					planId: subscription.planId,
					status: subscription.status,
					currentPeriodEnd: subscription.currentPeriodEnd,
				},
			});
		} catch (error) {
			console.error("Failed to send email:", error);
			this.logFallback(subscription, "confirmation");
		}
	}

	async sendSubscriptionCancellation(
		subscription: MemberSubscription,
		reason?: string,
	): Promise<void> {
		if (!this.apiKey) {
			this.logFallback(subscription, "cancellation", reason);
			return;
		}

		try {
			await this.sendEmail({
				to: subscription.customerId,
				subject: "Subscription Cancelled",
				template: "subscription-cancellation",
				data: {
					subscriptionId: subscription.id,
					planId: subscription.planId,
					reason: reason || "Not specified",
					cancelledAt: subscription.cancelledAt,
				},
			});
		} catch (error) {
			console.error("Failed to send email:", error);
			this.logFallback(subscription, "cancellation", reason);
		}
	}

	async sendPaymentFailed(subscription: MemberSubscription): Promise<void> {
		if (!this.apiKey) {
			this.logFallback(subscription, "payment-failed");
			return;
		}

		try {
			await this.sendEmail({
				to: subscription.customerId,
				subject: "Payment Failed - Action Required",
				template: "payment-failed",
				data: {
					subscriptionId: subscription.id,
					stripeSubscriptionId: subscription.stripeSubscriptionId,
					currentPeriodEnd: subscription.currentPeriodEnd,
				},
			});
		} catch (error) {
			console.error("Failed to send email:", error);
			this.logFallback(subscription, "payment-failed");
		}
	}

	async sendTrialEnding(subscription: MemberSubscription): Promise<void> {
		if (!this.apiKey) {
			this.logFallback(subscription, "trial-ending");
			return;
		}

		try {
			await this.sendEmail({
				to: subscription.customerId,
				subject: "Your Trial is Ending Soon",
				template: "trial-ending",
				data: {
					subscriptionId: subscription.id,
					stripeSubscriptionId: subscription.stripeSubscriptionId,
					trialEnd: subscription.trialEnd,
				},
			});
		} catch (error) {
			console.error("Failed to send email:", error);
			this.logFallback(subscription, "trial-ending");
		}
	}

	private async sendEmail(data: {
		to: string;
		subject: string;
		template: string;
		data: Record<string, unknown>;
	}): Promise<void> {
		const response = await fetch(`${this.apiUrl}/emails`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				from: this.fromEmail,
				to: data.to,
				subject: data.subject,
				template: data.template,
				data: data.data,
			}),
		});

		if (!response.ok) {
			throw new Error(`Email API failed: ${response.statusText}`);
		}
	}

	private logFallback(
		subscription: MemberSubscription,
		type: string,
		reason?: string,
	): void {
		console.log(
			`[NOTIFICATION FALLBACK] ${type} for customer ${subscription.customerId}, plan ${subscription.planId}${reason ? `. Reason: ${reason}` : ""}`,
		);
	}
}
