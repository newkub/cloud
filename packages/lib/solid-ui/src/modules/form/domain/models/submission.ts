// Form Submission - Submission types

import type { FieldValue } from "./field-state";

export interface FormSubmission<T = Record<string, FieldValue>> {
	values: T;
	errors: Record<string, string[]>;
	isValid: boolean;
	isSubmitting: boolean;
	isSubmitted: boolean;
	submitCount: number;
}

export interface SubmitOptions {
	preventDefault?: boolean;
	validation?: boolean;
}
