// ============================================================================
// Subscription Module - Subscription Workflow
// ============================================================================

import { calculateProrationAmount } from "../../domain/operations/business-rules";
import { validatePlanTransition } from "../../domain/validators/validation";
import type {
	MemberSubscriptionRepository,
	NotificationServiceAdapter,
	PaymentGatewayAdapter,
	SubscriptionEventPublisher,
	SubscriptionPlanRepository,
} from "../../ports/subscription-repository";
import type { MemberSubscription } from "../../types";

export interface SubscriptionWorkflowDependencies {
	readonly planRepository: SubscriptionPlanRepository;
	readonly subscriptionRepository: MemberSubscriptionRepository;
	readonly paymentGateway: PaymentGatewayAdapter;
	readonly notificationService: NotificationServiceAdapter;
	readonly eventPublisher: SubscriptionEventPublisher;
}

export interface ChangeSubscriptionPlanRequest {
	readonly subscriptionId: string;
	readonly newPlanId: string;
	readonly prorate: boolean;
	readonly billingCycleAlignment: "immediate" | "next_billing";
}

export const changeSubscriptionPlan =
	(deps: SubscriptionWorkflowDependencies) =>
	async (
		request: ChangeSubscriptionPlanRequest,
		now: number = Date.now(),
	): Promise<MemberSubscription> => {
		try {
			// Get current subscription and new plan
			const currentSubscription =
				await deps.subscriptionRepository.getSubscription(
					request.subscriptionId,
				);
			if (!currentSubscription) {
				throw new Error(
					`Subscription with id ${request.subscriptionId} not found`,
				);
			}

			const newPlan = await deps.planRepository.getPlan(request.newPlanId);
			if (!newPlan) {
				throw new Error(`Plan with id ${request.newPlanId} not found`);
			}

			// Validate plan transition
			const currentPlan =
				currentSubscription.plan ||
				(await deps.planRepository.getPlan(
					currentSubscription.planId as string,
				));
			if (!currentPlan) {
				throw new Error(
					`Current plan with id ${currentSubscription.planId} not found`,
				);
			}
			const transitionValidation = validatePlanTransition(currentPlan, newPlan);
			if (!transitionValidation.success) {
				throw new Error(
					`Invalid plan transition: ${transitionValidation.errors.map((e) => e.message).join(", ")}`,
				);
			}

			// Calculate proration if requested
			let prorationAmount = 0;
			if (request.prorate) {
				const daysInPeriod = 30; // Simplified - should calculate from actual billing cycle
				const daysRemaining = Math.ceil(
					(new Date(
						currentSubscription.nextBillingDate ||
							currentSubscription.currentPeriodEnd,
					).getTime() -
						now) /
						(1000 * 60 * 60 * 24),
				);

				const fromPlan =
					currentSubscription.plan ||
					(await deps.planRepository.getPlan(
						currentSubscription.planId as string,
					));
				if (!fromPlan) {
					throw new Error(
						`Current plan with id ${currentSubscription.planId} not found for proration`,
					);
				}
				prorationAmount = calculateProrationAmount(
					fromPlan,
					newPlan,
					daysInPeriod,
					daysRemaining,
				);

				// Process proration payment if needed
				if (prorationAmount > 0 && currentSubscription.paymentMethod) {
					const paymentResult = await deps.paymentGateway.processPayment(
						prorationAmount,
						newPlan.currency,
						currentSubscription.paymentMethod,
					);

					if (!paymentResult.success) {
						throw new Error(`Proration payment failed: ${paymentResult.error}`);
					}
				}
			}

			// Update subscription
			const updatedSubscription =
				await deps.subscriptionRepository.updateSubscription(
					request.subscriptionId,
					{
						planId: newPlan.id,
						plan: newPlan,
						amount: newPlan.price,
						// Update next billing date based on alignment preference
						nextBillingDate:
							request.billingCycleAlignment === "immediate"
								? new Date(now).toISOString()
								: currentSubscription.nextBillingDate ||
									currentSubscription.currentPeriodEnd,
					},
				);

			// Send notification about plan change
			await deps.notificationService.sendSubscriptionConfirmation(
				updatedSubscription,
			);

			return updatedSubscription;
		} catch (error) {
			throw new Error(`Failed to change subscription plan: ${error}`);
		}
	};

export interface RenewSubscriptionRequest {
	readonly subscriptionId: string;
	readonly paymentMethod?: string;
}

export const renewSubscription =
	(deps: SubscriptionWorkflowDependencies) =>
	async (request: RenewSubscriptionRequest): Promise<MemberSubscription> => {
		try {
			const subscription = await deps.subscriptionRepository.getSubscription(
				request.subscriptionId,
			);
			if (!subscription) {
				throw new Error(
					`Subscription with id ${request.subscriptionId} not found`,
				);
			}

			// Process renewal payment
			const paymentMethod = request.paymentMethod || subscription.paymentMethod;
			if (!paymentMethod) {
				throw new Error("No payment method available for renewal");
			}

			const paymentResult = await deps.paymentGateway.processPayment(
				subscription.amount || 0,
				typeof subscription.plan === "string"
					? subscription.plan
					: subscription.plan?.currency || "USD",
				paymentMethod,
			);

			if (!paymentResult.success) {
				throw new Error(`Renewal payment failed: ${paymentResult.error}`);
			}

			// Update subscription with new billing date
			const nextBillingDate = new Date(
				subscription.nextBillingDate || subscription.currentPeriodEnd,
			);
			nextBillingDate.setMonth(nextBillingDate.getMonth() + 1); // Simplified monthly billing

			const renewedSubscription =
				await deps.subscriptionRepository.updateSubscription(
					request.subscriptionId,
					{
						nextBillingDate: nextBillingDate.toISOString(),
						status: "active", // Ensure status is active after successful renewal
					},
				);

			// Send renewal confirmation
			await deps.notificationService.sendSubscriptionConfirmation(
				renewedSubscription,
			);

			return renewedSubscription;
		} catch (error) {
			throw new Error(`Failed to renew subscription: ${error}`);
		}
	};

export const processFailedPayments =
	(deps: SubscriptionWorkflowDependencies) => async (): Promise<void> => {
		try {
			const activeSubscriptions =
				await deps.subscriptionRepository.getActiveSubscriptions();
			const pastDueSubscriptions = activeSubscriptions.filter(
				(sub) =>
					sub.nextBillingDate && new Date(sub.nextBillingDate) <= new Date(),
			);

			for (const subscription of pastDueSubscriptions) {
				// Try to process payment again
				if (subscription.paymentMethod) {
					const currentPlan =
						subscription.plan ||
						(await deps.planRepository.getPlan(subscription.planId as string));
					if (!currentPlan) {
						throw new Error(
							`Plan with id ${subscription.planId} not found for payment processing`,
						);
					}
					const paymentResult = await deps.paymentGateway.processPayment(
						subscription.amount || 0,
						currentPlan.currency,
						subscription.paymentMethod,
					);

					if (!paymentResult.success) {
						// Mark as past due and send notification
						await deps.subscriptionRepository.updateSubscription(
							subscription.id,
							{
								status: "past_due",
							},
						);

						await deps.notificationService.sendPaymentFailed(subscription);
					}
				}
			}
		} catch (error) {
			throw new Error(`Failed to process failed payments: ${error}`);
		}
	};
