// ============================================================================
// Adapters - External - Stripe Payment Gateway Adapter
// ============================================================================

import Stripe from "stripe";
import type { PaymentGatewayAdapter } from "#modules/subscription/ports/subscription-repository";
import { STRIPE_API_VERSION } from "#shared/constants";

export class StripePaymentGatewayAdapter implements PaymentGatewayAdapter {
	private stripe: Stripe;

	constructor() {
		const secretKey = process.env.STRIPE_SECRET_KEY;

		if (!secretKey) {
			throw new Error(
				"STRIPE_SECRET_KEY environment variable is not set. Please set it in your .env file.",
			);
		}

		this.stripe = new Stripe(secretKey, {
			apiVersion: STRIPE_API_VERSION,
		});
	}

	async processPayment(
		amount: number,
		currency: string,
		paymentMethod: string,
	): Promise<{ success: boolean; transactionId?: string; error?: string }> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.create({
				amount,
				currency,
				payment_method: paymentMethod,
				confirm: true,
				automatic_payment_methods: {
					enabled: true,
					allow_redirects: "never",
				},
			});

			if (paymentIntent.status === "succeeded") {
				return {
					success: true,
					transactionId: paymentIntent.id,
				};
			}

			return {
				success: false,
				error: `Payment failed with status: ${paymentIntent.status}`,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			return {
				success: false,
				error: errorMessage,
			};
		}
	}

	async refundPayment(
		transactionId: string,
		amount?: number,
	): Promise<{ success: boolean; refundId?: string; error?: string }> {
		try {
			const refund = await this.stripe.refunds.create({
				payment_intent: transactionId,
				amount,
			});

			return {
				success: true,
				refundId: refund.id,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			return {
				success: false,
				error: errorMessage,
			};
		}
	}

	async createPaymentIntent(
		amount: number,
		currency: string,
		customerId: string,
	): Promise<{ clientSecret: string; paymentIntentId: string }> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.create({
				amount,
				currency,
				customer: customerId,
				automatic_payment_methods: {
					enabled: true,
				},
			});

			if (!paymentIntent.client_secret) {
				throw new Error(
					"Failed to create payment intent: no client secret returned",
				);
			}

			return {
				clientSecret: paymentIntent.client_secret,
				paymentIntentId: paymentIntent.id,
			};
		} catch (error) {
			throw new Error(
				`Failed to create payment intent: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}

export const stripeAdapter: StripePaymentGatewayAdapter =
	new StripePaymentGatewayAdapter();
