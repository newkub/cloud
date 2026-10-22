// ============================================================================
// Payment Module - Domain Validation
// ============================================================================

import type { DomainError } from "../../../../shared/errors/domain-errors";
import { createValidationError } from "../../../../shared/errors/domain-errors";
import type { Result } from "../../../../shared/types/result-either";
import { failure } from "../../../../shared/types/result-either";
import type {
	ConfirmPaymentRequest,
	CreatePaymentIntentRequest,
	RefundRequest,
} from "../../types";

// Create Payment Intent Validation
export const validateCreatePaymentIntentRequest = (
	request: CreatePaymentIntentRequest,
): Result<CreatePaymentIntentRequest, DomainError> => {
	if (request.amount <= 0) {
		return failure(
			createValidationError(
				"amount",
				request.amount,
				"Amount must be greater than zero",
			),
		);
	}

	if (!request.currency || request.currency.trim().length === 0) {
		return failure(
			createValidationError(
				"currency",
				request.currency,
				"Currency is required",
			),
		);
	}

	if (request.currency.length !== 3) {
		return failure(
			createValidationError(
				"currency",
				request.currency,
				"Currency must be a 3-letter ISO code",
			),
		);
	}

	return { success: true, data: request };
};

// Confirm Payment Validation
export const validateConfirmPaymentRequest = (
	request: ConfirmPaymentRequest,
): Result<ConfirmPaymentRequest, DomainError> => {
	if (!request.paymentIntentId || request.paymentIntentId.trim().length === 0) {
		return failure(
			createValidationError(
				"paymentIntentId",
				request.paymentIntentId,
				"Payment Intent ID is required",
			),
		);
	}

	return { success: true, data: request };
};

// Refund Request Validation
export const validateRefundRequest = (
	request: RefundRequest,
): Result<RefundRequest, DomainError> => {
	if (!request.paymentIntentId || request.paymentIntentId.trim().length === 0) {
		return failure(
			createValidationError(
				"paymentIntentId",
				request.paymentIntentId,
				"Payment Intent ID is required",
			),
		);
	}

	if (request.amount !== undefined && request.amount <= 0) {
		return failure(
			createValidationError(
				"amount",
				request.amount,
				"Refund amount must be greater than zero",
			),
		);
	}

	return { success: true, data: request };
};
