// ============================================================================
// Payment Module - Domain Operations (Pure Functions)
// ============================================================================

import type { PaymentIntent } from "../../types";

// Payment Intent Creation
export const createPaymentIntent = (
	params: {
		id: string;
		amount: number;
		currency: string;
	},
	now: number = Date.now(),
): PaymentIntent => ({
	id: params.id,
	amount: params.amount,
	currency: params.currency,
	status: "requires_payment_method",
	createdAt: new Date(now),
});

// Payment Intent Status Checks
export const isPaymentIntentSucceeded = (payment: PaymentIntent): boolean =>
	payment.status === "succeeded";

export const isPaymentIntentFailed = (payment: PaymentIntent): boolean =>
	payment.status === "failed";

export const isPaymentIntentCanceled = (payment: PaymentIntent): boolean =>
	payment.status === "canceled";

export const isPaymentIntentProcessing = (payment: PaymentIntent): boolean =>
	payment.status === "processing";

export const isPaymentIntentPending = (payment: PaymentIntent): boolean =>
	[
		"requires_payment_method",
		"requires_confirmation",
		"requires_action",
	].includes(payment.status);

export const isPaymentIntentActionable = (payment: PaymentIntent): boolean =>
	[
		"requires_payment_method",
		"requires_confirmation",
		"requires_action",
	].includes(payment.status);

// Payment Method Checks
export const isCardPaymentMethod = (paymentMethod: { type: string }): boolean =>
	paymentMethod.type === "card";

export const getPaymentMethodDescription = (paymentMethod: {
	card?: { brand: string; last4: string };
}): string => {
	if (!paymentMethod.card) return "Unknown";
	return `${paymentMethod.card.brand} ending in ${paymentMethod.card.last4}`;
};

// Amount Calculations
export const calculateRefundableAmount = (
	payment: PaymentIntent,
	refundedAmount: number,
): number => payment.amount - refundedAmount;

export const canRefundFullAmount = (
	payment: PaymentIntent,
	refundedAmount: number,
): boolean => refundedAmount === 0 && isPaymentIntentSucceeded(payment);

export const canRefundPartialAmount = (
	payment: PaymentIntent,
	refundedAmount: number,
): boolean =>
	refundedAmount < payment.amount && isPaymentIntentSucceeded(payment);
