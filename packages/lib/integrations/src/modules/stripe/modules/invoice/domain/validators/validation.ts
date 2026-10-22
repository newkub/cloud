// ============================================================================
// Invoice Module - Domain Validation
// ============================================================================

import type { DomainError } from "../../../../shared/errors/domain-errors";
import { createValidationError } from "../../../../shared/errors/domain-errors";
import type { Result } from "../../../../shared/types/result-either";
import { failure } from "../../../../shared/types/result-either";
import type { CreateInvoiceRequest } from "../../types";

// Create Invoice Validation
export const validateCreateInvoiceRequest = (
	request: CreateInvoiceRequest,
): Result<CreateInvoiceRequest, DomainError> => {
	if (!request.customerId || request.customerId.trim().length === 0) {
		return failure(
			createValidationError(
				"customerId",
				request.customerId,
				"Customer ID is required",
			),
		);
	}

	if (request.items && request.items.length === 0) {
		return failure(
			createValidationError(
				"items",
				request.items,
				"At least one item is required",
			),
		);
	}

	if (request.items) {
		for (const item of request.items) {
			if (!item.description || item.description.trim().length === 0) {
				return failure(
					createValidationError(
						"item.description",
						item.description,
						"Item description is required",
					),
				);
			}
			if (item.quantity <= 0) {
				return failure(
					createValidationError(
						"item.quantity",
						item.quantity,
						"Item quantity must be greater than zero",
					),
				);
			}
			if (item.unitAmount <= 0) {
				return failure(
					createValidationError(
						"item.unitAmount",
						item.unitAmount,
						"Item unit amount must be greater than zero",
					),
				);
			}
		}
	}

	return { success: true, data: request };
};
