// Form Domain Events
// Domain event types for form operations

import type { FieldDef, FormSubmission } from "../models";

export type FormField = FieldDef;
export type FormState = FormSubmission;

export type FormEventType =
	| "fieldChanged"
	| "fieldTouched"
	| "fieldBlurred"
	| "fieldValidated"
	| "fieldInvalid"
	| "formSubmitted"
	| "formReset"
	| "formValidated"
	| "formInvalid"
	| "formDirty"
	| "formPristine";

export interface FormEventData {
	fieldName?: string;
	fieldValue?: unknown;
	field?: FormField;
	formState?: FormState;
	errors?: Record<string, string[]>;
	touched?: string[];
	dirty?: string[];
}

export interface FormEvent {
	type: FormEventType;
	data: FormEventData;
	timestamp: number;
}
