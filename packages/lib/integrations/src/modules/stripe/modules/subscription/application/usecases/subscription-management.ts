// ============================================================================
// Subscription Module - Subscription Management Use Cases
// ============================================================================

import {
	createSubscriptionCancelledEvent,
	createSubscriptionCreatedEvent,
} from "../../domain/events/subscription-events";
import { isTrialExpired } from "../../domain/operations/business-rules";
import { isSubscriptionActive } from "../../domain/operations/subscription-operations";
import {
	validateCancelSubscriptionRequest,
	validateSubscribeCustomerRequest,
} from "../../domain/validators/validation";
import type {
	MemberSubscriptionRepository,
	NotificationServiceAdapter,
	SubscriptionEventPublisher,
} from "../../ports/subscription-repository";
import type {
	CancelSubscriptionRequest,
	MemberSubscription,
	SubscribeCustomerRequest,
	SubscriptionFilters,
} from "../../types";

export interface SubscriptionManagementDependencies {
	readonly subscriptionRepository: MemberSubscriptionRepository;
	readonly eventPublisher: SubscriptionEventPublisher;
	readonly notificationService: NotificationServiceAdapter;
}

export const subscribeCustomer =
	(deps: SubscriptionManagementDependencies) =>
	async (
		request: SubscribeCustomerRequest,
		id: string,
		now: string,
	): Promise<MemberSubscription> => {
		const validationResult = validateSubscribeCustomerRequest(request);
		if (!validationResult.success) {
			throw new Error(validationResult.errors.map((e) => e.message).join(", "));
		}

		try {
			const subscription = await deps.subscriptionRepository.createSubscription(
				validationResult.data,
			);

			// Publish domain event
			const event = createSubscriptionCreatedEvent(subscription, id, now);
			await deps.eventPublisher.publish(event);

			// Send notification
			await deps.notificationService.sendSubscriptionConfirmation(subscription);

			return subscription;
		} catch (error: unknown) {
			throw new Error(
				`Failed to create subscription: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};

export const cancelSubscription =
	(deps: SubscriptionManagementDependencies) =>
	async (
		request: CancelSubscriptionRequest,
		id: string,
		now: string,
	): Promise<void> => {
		const validationResult = validateCancelSubscriptionRequest(request);
		if (!validationResult.success) {
			throw new Error(validationResult.errors.map((e) => e.message).join(", "));
		}

		try {
			const subscription = await deps.subscriptionRepository.getSubscription(
				request.subscriptionId,
			);
			if (!subscription) {
				throw new Error(
					`Subscription with id ${request.subscriptionId} not found`,
				);
			}

			// Update subscription status
			const updatedSubscription =
				await deps.subscriptionRepository.updateSubscription(
					request.subscriptionId,
					{
						status: "cancelled",
						cancelledAt: now,
					},
				);

			// Publish domain event
			const event = createSubscriptionCancelledEvent(
				updatedSubscription,
				request.reason,
				id,
				now,
			);
			await deps.eventPublisher.publish(event);

			// Send notification
			await deps.notificationService.sendSubscriptionCancellation(
				updatedSubscription,
				request.reason,
			);
		} catch (error: unknown) {
			throw new Error(
				`Failed to cancel subscription: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};

export const pauseSubscription =
	(deps: SubscriptionManagementDependencies) =>
	async (subscriptionId: string): Promise<void> => {
		try {
			const subscription =
				await deps.subscriptionRepository.getSubscription(subscriptionId);
			if (!subscription) {
				throw new Error(`Subscription with id ${subscriptionId} not found`);
			}

			if (!isSubscriptionActive(subscription)) {
				throw new Error("Only active subscriptions can be paused");
			}

			await deps.subscriptionRepository.updateSubscription(subscriptionId, {
				status: "paused",
			});
		} catch (error: unknown) {
			throw new Error(
				`Failed to pause subscription: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};

export const resumeSubscription =
	(deps: SubscriptionManagementDependencies) =>
	async (subscriptionId: string): Promise<void> => {
		try {
			const subscription =
				await deps.subscriptionRepository.getSubscription(subscriptionId);
			if (!subscription) {
				throw new Error(`Subscription with id ${subscriptionId} not found`);
			}

			if (subscription.status !== "paused") {
				throw new Error("Only paused subscriptions can be resumed");
			}

			await deps.subscriptionRepository.updateSubscription(subscriptionId, {
				status: "active",
			});
		} catch (error: unknown) {
			throw new Error(
				`Failed to resume subscription: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};

export const getSubscription =
	(deps: SubscriptionManagementDependencies) =>
	async (id: string): Promise<MemberSubscription | null> => {
		return deps.subscriptionRepository.getSubscription(id);
	};

export const getSubscriptionsByCustomer =
	(deps: SubscriptionManagementDependencies) =>
	async (customerId: string): Promise<readonly MemberSubscription[]> => {
		return deps.subscriptionRepository.getSubscriptionsByCustomer(customerId);
	};

export const getSubscriptionsWithFilters =
	(deps: SubscriptionManagementDependencies) =>
	async (
		filters: SubscriptionFilters,
	): Promise<readonly MemberSubscription[]> => {
		return deps.subscriptionRepository.getSubscriptionsWithFilters(filters);
	};

export const getAllSubscriptions =
	(deps: SubscriptionManagementDependencies) =>
	async (): Promise<readonly MemberSubscription[]> => {
		return deps.subscriptionRepository.getAllSubscriptions();
	};

export const getActiveSubscriptions =
	(deps: SubscriptionManagementDependencies) =>
	async (): Promise<readonly MemberSubscription[]> => {
		return deps.subscriptionRepository.getActiveSubscriptions();
	};

export const processExpiringTrials =
	(deps: SubscriptionManagementDependencies) =>
	async (now: Date): Promise<void> => {
		try {
			const activeSubscriptions =
				await deps.subscriptionRepository.getActiveSubscriptions();
			const trialingSubscriptions = activeSubscriptions.filter(
				(sub) => sub.status === "trialing",
			);

			for (const subscription of trialingSubscriptions) {
				if (isTrialExpired(subscription, now)) {
					// Convert to paid or cancel based on business logic
					await deps.subscriptionRepository.updateSubscription(
						subscription.id,
						{
							status: "active", // or 'cancelled' based on business rules
						},
					);
				}
			}
		} catch (error: unknown) {
			throw new Error(
				`Failed to process expiring trials: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};
