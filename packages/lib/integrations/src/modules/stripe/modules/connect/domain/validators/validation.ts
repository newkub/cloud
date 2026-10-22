// ============================================================================
// Connect Module - Domain Validation
// ============================================================================

import { createValidationError } from "#shared/errors/domain-errors";
import type { DomainError } from "#shared/errors/error-types";
import type { Result } from "#shared/types/result-either";
import { failure, success } from "#shared/types/result-either";
import type {
	AccountLinkRequest,
	CreateAccountRequest,
	UpdateAccountRequest,
} from "../../types";

// Email validation
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Country code validation (ISO 3166-1 alpha-2)
const isValidCountryCode = (country: string): boolean => {
	return /^[A-Z]{2}$/.test(country);
};

// URL validation
const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

// Business profile validation
const validateBusinessProfile = (profile: {
	readonly name: string;
	readonly url?: string;
	readonly supportEmail?: string;
}): Result<
	{
		readonly name: string;
		readonly url?: string;
		readonly supportEmail?: string;
	},
	DomainError
> => {
	if (!profile.name || profile.name.trim().length === 0) {
		return failure(
			createValidationError(
				"businessProfile.name",
				profile.name,
				"Business name is required",
			),
		);
	}

	if (profile.url && !isValidUrl(profile.url)) {
		return failure(
			createValidationError(
				"businessProfile.url",
				profile.url,
				"Invalid URL format",
			),
		);
	}

	if (profile.supportEmail && !isValidEmail(profile.supportEmail)) {
		return failure(
			createValidationError(
				"businessProfile.supportEmail",
				profile.supportEmail,
				"Invalid email format",
			),
		);
	}

	return { success: true, data: profile };
};

// Create Account Validation
export const validateCreateAccountRequest = (
	request: CreateAccountRequest,
): Result<CreateAccountRequest, DomainError> => {
	if (!request.email || !isValidEmail(request.email)) {
		return failure(
			createValidationError("email", request.email, "Invalid email format"),
		);
	}

	if (!isValidCountryCode(request.country)) {
		return failure(
			createValidationError(
				"country",
				request.country,
				"Invalid country code (must be ISO 3166-1 alpha-2)",
			),
		);
	}

	if (request.businessProfile) {
		const profileResult = validateBusinessProfile(request.businessProfile);
		if (!profileResult.success) {
			return profileResult;
		}
	}

	return success<CreateAccountRequest, DomainError>(request);
};

// Update Account Validation
export const validateUpdateAccountRequest = (
	request: UpdateAccountRequest,
): Result<UpdateAccountRequest, DomainError> => {
	if (!request.accountId || request.accountId.trim().length === 0) {
		return failure(
			createValidationError(
				"accountId",
				request.accountId,
				"Account ID is required",
			),
		);
	}

	if (request.businessProfile) {
		const profileResult = validateBusinessProfile(request.businessProfile);
		if (!profileResult.success) {
			return profileResult;
		}
	}

	return success<UpdateAccountRequest, DomainError>(request);
};

// Account Link Validation
export const validateAccountLinkRequest = (
	request: AccountLinkRequest,
): Result<AccountLinkRequest, DomainError> => {
	if (!request.accountId || request.accountId.trim().length === 0) {
		return failure(
			createValidationError(
				"accountId",
				request.accountId,
				"Account ID is required",
			),
		);
	}

	if (!request.refreshUrl || !isValidUrl(request.refreshUrl)) {
		return failure(
			createValidationError(
				"refreshUrl",
				request.refreshUrl,
				"Invalid refresh URL",
			),
		);
	}

	if (!request.returnUrl || !isValidUrl(request.returnUrl)) {
		return failure(
			createValidationError(
				"returnUrl",
				request.returnUrl,
				"Invalid return URL",
			),
		);
	}

	return success<AccountLinkRequest, DomainError>(request);
};
