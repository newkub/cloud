/**
 * Form Module - Public API exports
 */

// Types
export type { FormContextValue } from "./application/form-context-types";
// Domain (types)
export type {
	FieldDef,
	FieldState as FormFieldState,
	FieldType,
	FieldValue,
	FormConfig,
	FormSubmission,
	ValidationResult,
	ValidationRule as FormValidationRule,
} from "./domain/models";
// Domain (field factories)
export {
	createCheckboxField,
	createEmailField,
	createFileField,
	createNumberField,
	createPasswordField,
	createSelectField,
	createTextareaField,
	createTextField,
} from "./domain/models/factories";
// Domain (pure operations)
export {
	buildValidationRules,
	coerceValue,
	deepEqual,
	formatFileSize,
	getDefaultValue,
	getFirstError,
	hasErrors,
	isRequired,
	maybeTrim,
	validateField,
} from "./domain/operations";
// Domain (validation helpers)
export {
	createRule,
	email,
	match,
	maxLength,
	minLength,
	pattern,
	required,
} from "./domain/validators/helpers";
// Ports (interfaces)
export type {
	AsyncValidator,
	FieldAdapter,
	FormManager,
	FormPersistence,
	FormSubmitter,
	Validator,
} from "./ports";
