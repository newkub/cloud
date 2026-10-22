// ============================================================================
// Checkout Module - Domain Operations (Pure Functions)
// ============================================================================

import type { CheckoutSession } from "../../types";

// Session Creation
export const createCheckoutSession = (
	params: {
		id: string;
		url: string;
		amountTotal: number;
		currency: string;
		expiresAt: Date;
	},
	now: number = Date.now(),
): CheckoutSession => ({
	id: params.id,
	url: params.url,
	status: "open",
	paymentStatus: "unpaid",
	amountTotal: params.amountTotal,
	currency: params.currency,
	createdAt: new Date(now),
	expiresAt: params.expiresAt,
});

// Session Status Checks
export const isSessionOpen = (session: CheckoutSession): boolean =>
	session.status === "open";

export const isSessionComplete = (session: CheckoutSession): boolean =>
	session.status === "complete";

export const isSessionExpired = (session: CheckoutSession): boolean =>
	session.status === "expired";

export const isSessionPaid = (session: CheckoutSession): boolean =>
	session.paymentStatus === "paid";

// Session Validity
export const isSessionValid = (
	session: CheckoutSession,
	now2: number = Date.now(),
): boolean => {
	const now = new Date(now2);
	return isSessionOpen(session) && session.expiresAt > now;
};

export const getSessionExpiryTime = (
	session: CheckoutSession,
	now: number = Date.now(),
): number => {
	return session.expiresAt.getTime() - now;
};

// Amount Calculations
export const calculateTotalAmount = (
	lineItems: readonly { amount: number; quantity: number }[],
): number =>
	lineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
