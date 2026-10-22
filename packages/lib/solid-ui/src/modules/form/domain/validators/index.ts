// Form Domain Validators
// Pure validation functions for form fields and submissions
// Using Arktype for type-safe runtime validation

import { type } from "arktype";
import {
	baseFieldSchema,
	checkboxFieldSchema,
	dateFieldSchema,
	fieldDefSchema,
	fieldMetaSchema,
	fieldStateSchema,
	fieldTypeSchema,
	fieldValueSchema,
	fileFieldSchema,
	formConfigSchema,
	hiddenFieldSchema,
	numberFieldSchema,
	radioFieldSchema,
	selectFieldSchema,
	submitOptionsSchema,
	textareaFieldSchema,
	textFieldSchema,
	validationResultSchema,
	validationRuleSchema,
} from "./schemas";

/**
 * Validate field type using Arktype
 */
export const validateFieldType = (fieldType: unknown): fieldType is typeof fieldTypeSchema.infer => {
	const result = fieldTypeSchema(fieldType);
	return !(result instanceof type.errors);
};

/**
 * Validate base field using Arktype
 */
export const validateBaseField = (field: unknown): field is typeof baseFieldSchema.infer => {
	const result = baseFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate text field using Arktype
 */
export const validateTextField = (field: unknown): field is typeof textFieldSchema.infer => {
	const result = textFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate number field using Arktype
 */
export const validateNumberField = (field: unknown): field is typeof numberFieldSchema.infer => {
	const result = numberFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate date field using Arktype
 */
export const validateDateField = (field: unknown): field is typeof dateFieldSchema.infer => {
	const result = dateFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate checkbox field using Arktype
 */
export const validateCheckboxField = (field: unknown): field is typeof checkboxFieldSchema.infer => {
	const result = checkboxFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate radio field using Arktype
 */
export const validateRadioField = (field: unknown): field is typeof radioFieldSchema.infer => {
	const result = radioFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate select field using Arktype
 */
export const validateSelectField = (field: unknown): field is typeof selectFieldSchema.infer => {
	const result = selectFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate textarea field using Arktype
 */
export const validateTextareaField = (field: unknown): field is typeof textareaFieldSchema.infer => {
	const result = textareaFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate file field using Arktype
 */
export const validateFileField = (field: unknown): field is typeof fileFieldSchema.infer => {
	const result = fileFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate hidden field using Arktype
 */
export const validateHiddenField = (field: unknown): field is typeof hiddenFieldSchema.infer => {
	const result = hiddenFieldSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate field definition using Arktype
 */
export const validateFieldDef = (field: unknown): field is typeof fieldDefSchema.infer => {
	const result = fieldDefSchema(field);
	return !(result instanceof type.errors);
};

/**
 * Validate form config using Arktype
 */
export const validateFormConfig = (config: unknown): config is typeof formConfigSchema.infer => {
	const result = formConfigSchema(config);
	return !(result instanceof type.errors);
};

/**
 * Validate field value using Arktype
 */
export const validateFieldValue = (value: unknown): value is typeof fieldValueSchema.infer => {
	const result = fieldValueSchema(value);
	return !(result instanceof type.errors);
};

/**
 * Validate field state using Arktype
 */
export const validateFieldState = (state: unknown): state is typeof fieldStateSchema.infer => {
	const result = fieldStateSchema(state);
	return !(result instanceof type.errors);
};

/**
 * Validate field meta using Arktype
 */
export const validateFieldMeta = (meta: unknown): meta is typeof fieldMetaSchema.infer => {
	const result = fieldMetaSchema(meta);
	return !(result instanceof type.errors);
};

/**
 * Validate validation rule using Arktype
 */
export const validateValidationRule = (rule: unknown): rule is typeof validationRuleSchema.infer => {
	const result = validationRuleSchema(rule);
	return !(result instanceof type.errors);
};

/**
 * Validate validation result using Arktype
 */
export const validateValidationResult = (result: unknown): result is typeof validationResultSchema.infer => {
	const resultTyped = validationResultSchema(result);
	return !(resultTyped instanceof type.errors);
};

/**
 * Validate submit options using Arktype
 */
export const validateSubmitOptions = (options: unknown): options is typeof submitOptionsSchema.infer => {
	const result = submitOptionsSchema(options);
	return !(result instanceof type.errors);
};
