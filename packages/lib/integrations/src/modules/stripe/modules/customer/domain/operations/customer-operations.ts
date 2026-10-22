// ============================================================================
// Customer Module - Domain Operations (Pure Functions)
// ============================================================================

import type { Customer } from "../../types";

// Customer Creation
export const createCustomer = (
	params: {
		id: string;
		email: string;
		name?: string;
		phone?: string;
	},
	now: number = Date.now(),
): Customer => ({
	id: params.id,
	email: params.email,
	name: params.name,
	phone: params.phone,
	createdAt: new Date(now),
	updatedAt: new Date(now),
});

// Customer Validation
export const isValidCustomerEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const isValidCustomerPhone = (phone: string): boolean => {
	const phoneRegex = /^\+?[\d\s-()]+$/;
	return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

// Customer Checks
export const hasPaymentMethods = (_customer: Customer): boolean => {
	return true; // This would check against payment methods in real implementation
};

export const hasActiveSubscriptions = (_customer: Customer): boolean => {
	return false; // This would check against subscriptions in real implementation
};

// Customer Display
export const getCustomerDisplayName = (customer: Customer): string => {
	return customer.name || customer.email;
};

export const getCustomerInitials = (customer: Customer): string => {
	const name = customer.name || customer.email;
	const parts = name.split(" ");
	if (parts.length >= 2) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};
