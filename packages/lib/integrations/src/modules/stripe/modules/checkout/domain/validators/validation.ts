// ============================================================================
// Checkout Module - Domain Validation
// ============================================================================

import { createValidationError } from "#shared/errors/domain-errors";
import type { DomainError } from "#shared/errors/error-types";
import type { Result } from "#shared/types/result-either";
import { failure } from "#shared/types/result-either";
import type { CreateCheckoutSessionRequest } from "../../types";

// URL validation
const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

// Create Checkout Session Validation
export const validateCreateCheckoutSessionRequest = (
	request: CreateCheckoutSessionRequest,
): Result<CreateCheckoutSessionRequest, DomainError> => {
	if (!request.priceId || request.priceId.trim().length === 0) {
		return failure(
			createValidationError("priceId", request.priceId, "Price ID is required"),
		);
	}

	if (request.quantity !== undefined && request.quantity <= 0) {
		return failure(
			createValidationError(
				"quantity",
				request.quantity,
				"Quantity must be greater than zero",
			),
		);
	}

	if (!request.successUrl || !isValidUrl(request.successUrl)) {
		return failure(
			createValidationError(
				"successUrl",
				request.successUrl,
				"Invalid success URL",
			),
		);
	}

	if (!request.cancelUrl || !isValidUrl(request.cancelUrl)) {
		return failure(
			createValidationError(
				"cancelUrl",
				request.cancelUrl,
				"Invalid cancel URL",
			),
		);
	}

	if (
		request.customerEmail &&
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.customerEmail)
	) {
		return failure(
			createValidationError(
				"customerEmail",
				request.customerEmail,
				"Invalid email format",
			),
		);
	}

	return { success: true, data: request };
};
