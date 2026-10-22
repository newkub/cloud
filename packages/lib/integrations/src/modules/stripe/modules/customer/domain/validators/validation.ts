// ============================================================================
// Customer Module - Domain Validation
// ============================================================================

import type { DomainError } from "../../../../shared/errors/domain-errors";
import { createValidationError } from "../../../../shared/errors/domain-errors";
import type { Result } from "../../../../shared/types/result-either";
import { failure } from "../../../../shared/types/result-either";
import type { CreateCustomerRequest, UpdateCustomerRequest } from "../../types";

// Email validation
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone: string): boolean => {
	const phoneRegex = /^\+?[\d\s-()]+$/;
	return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

// Create Customer Validation
export const validateCreateCustomerRequest = (
	request: CreateCustomerRequest,
): Result<CreateCustomerRequest, DomainError> => {
	if (!request.email || !isValidEmail(request.email)) {
		return failure(
			createValidationError("email", request.email, "Invalid email format"),
		);
	}

	if (request.phone && !isValidPhone(request.phone)) {
		return failure(
			createValidationError("phone", request.phone, "Invalid phone format"),
		);
	}

	return { success: true, data: request };
};

// Update Customer Validation
export const validateUpdateCustomerRequest = (
	request: UpdateCustomerRequest,
): Result<UpdateCustomerRequest, DomainError> => {
	if (!request.customerId || request.customerId.trim().length === 0) {
		return failure(
			createValidationError(
				"customerId",
				request.customerId,
				"Customer ID is required",
			),
		);
	}

	if (request.phone && !isValidPhone(request.phone)) {
		return failure(
			createValidationError("phone", request.phone, "Invalid phone format"),
		);
	}

	return { success: true, data: request };
};
