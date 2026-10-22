// ============================================================================
// Subscription Module - Domain Validation Operations
// ============================================================================

import type {
	CancelSubscriptionRequest,
	CreatePlanRequest,
	SubscribeCustomerRequest,
	SubscriptionPlan,
	UpdatePlanRequest,
} from "../../types";

export type ValidationError = {
	readonly field: string;
	readonly message: string;
};

export type ValidationResult<T> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly errors: readonly ValidationError[] };

export const validateCreatePlanRequest = (
	request: CreatePlanRequest,
): ValidationResult<CreatePlanRequest> => {
	const errors: ValidationError[] = [];

	if (!request.organizationId?.trim()) {
		errors.push({
			field: "organizationId",
			message: "Organization ID is required",
		});
	}

	if (!request.name?.trim()) {
		errors.push({ field: "name", message: "Plan name is required" });
	}

	if (request.price <= 0) {
		errors.push({ field: "price", message: "Price must be greater than 0" });
	}

	if (!request.currency?.trim()) {
		errors.push({ field: "currency", message: "Currency is required" });
	}

	if (request.intervalCount <= 0) {
		errors.push({
			field: "intervalCount",
			message: "Interval count must be greater than 0",
		});
	}

	if (request.trialDays < 0) {
		errors.push({
			field: "trialDays",
			message: "Trial days cannot be negative",
		});
	}

	if (request.maxMembers !== undefined && request.maxMembers <= 0) {
		errors.push({
			field: "maxMembers",
			message: "Max members must be greater than 0",
		});
	}

	if (request.setupFee !== undefined && request.setupFee < 0) {
		errors.push({ field: "setupFee", message: "Setup fee cannot be negative" });
	}

	if (!Array.isArray(request.features)) {
		errors.push({ field: "features", message: "Features must be an array" });
	}

	return errors.length > 0
		? { success: false, errors }
		: { success: true, data: request };
};

export const validateUpdatePlanRequest = (
	request: UpdatePlanRequest,
): ValidationResult<UpdatePlanRequest> => {
	const errors: ValidationError[] = [];

	if (request.price !== undefined && request.price <= 0) {
		errors.push({ field: "price", message: "Price must be greater than 0" });
	}

	if (request.maxMembers !== undefined && request.maxMembers <= 0) {
		errors.push({
			field: "maxMembers",
			message: "Max members must be greater than 0",
		});
	}

	if (request.setupFee !== undefined && request.setupFee < 0) {
		errors.push({ field: "setupFee", message: "Setup fee cannot be negative" });
	}

	if (request.features !== undefined && !Array.isArray(request.features)) {
		errors.push({ field: "features", message: "Features must be an array" });
	}

	return errors.length > 0
		? { success: false, errors }
		: { success: true, data: request };
};

export const validateSubscribeCustomerRequest = (
	request: SubscribeCustomerRequest,
): ValidationResult<SubscribeCustomerRequest> => {
	const errors: ValidationError[] = [];

	if (!request.customerId?.trim()) {
		errors.push({ field: "customerId", message: "Customer ID is required" });
	}

	if (!request.planId?.trim()) {
		errors.push({ field: "planId", message: "Plan ID is required" });
	}

	return errors.length > 0
		? { success: false, errors }
		: { success: true, data: request };
};

export const validateCancelSubscriptionRequest = (
	request: CancelSubscriptionRequest,
): ValidationResult<CancelSubscriptionRequest> => {
	const errors: ValidationError[] = [];

	if (!request.subscriptionId?.trim()) {
		errors.push({
			field: "subscriptionId",
			message: "Subscription ID is required",
		});
	}

	return errors.length > 0
		? { success: false, errors }
		: { success: true, data: request };
};

export const validatePlanTransition = (
	fromPlan: SubscriptionPlan,
	toPlan: SubscriptionPlan,
): ValidationResult<void> => {
	const errors: ValidationError[] = [];

	// Check if plans have compatible billing intervals
	if (fromPlan.interval !== toPlan.interval) {
		errors.push({
			field: "interval",
			message: "Cannot change billing interval during plan transition",
		});
	}

	// Check if price difference is reasonable (e.g., not more than 10x increase)
	const priceRatio = toPlan.price / fromPlan.price;
	if (priceRatio > 10) {
		errors.push({
			field: "price",
			message: "Price increase is too high for automatic transition",
		});
	}

	return errors.length > 0
		? { success: false, errors }
		: { success: true, data: undefined };
};
