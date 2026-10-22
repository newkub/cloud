// Form Validation Rules - Build validation rules for field types

import { type } from "arktype";
import type { FieldDef, FileField, NumberField, TextField, ValidationRule } from "../models";
import { formatFileSize } from "../operations/utils";
import {
	emailSchema,
	maxLengthSchema,
	maxSchema,
	minLengthSchema,
	minSchema,
	patternSchema,
	requiredSchema,
	telSchema,
	urlSchema,
} from "../validators/schemas/validators";

export const buildValidationRules = (field: FieldDef): ValidationRule[] => {
	const rules: ValidationRule[] = [];

	if ("required" in field && field.required) {
		rules.push({
			validate: (v) => {
				const result = requiredSchema(v);
				return !(result instanceof type.errors);
			},
			message: "This field is required",
		});
	}

	switch (field.type) {
		case "text":
		case "email":
		case "password":
		case "tel":
		case "url":
		case "search":
		case "textarea": {
			const textField = field as TextField;
			if (textField.minLength !== undefined) {
				const schema = minLengthSchema(textField.minLength);
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = schema(v);
						return !(result instanceof type.errors);
					},
					message: `Must be at least ${textField.minLength} characters`,
				});
			}
			if (textField.maxLength !== undefined) {
				const schema = maxLengthSchema(textField.maxLength);
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = schema(v);
						return !(result instanceof type.errors);
					},
					message: `Must be at most ${textField.maxLength} characters`,
				});
			}
			if (textField.pattern) {
				const schema = patternSchema(textField.pattern);
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = schema(v);
						return !(result instanceof type.errors);
					},
					message: "Invalid format",
				});
			}
			if (textField.type === "email") {
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = emailSchema(v);
						return !(result instanceof type.errors);
					},
					message: "Please enter a valid email address",
				});
			}
			if (textField.type === "url") {
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = urlSchema(v);
						return !(result instanceof type.errors);
					},
					message: "Please enter a valid URL",
				});
			}
			if (textField.type === "tel") {
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const result = telSchema(v);
						return !(result instanceof type.errors);
					},
					message: "Please enter a valid phone number",
				});
			}
			break;
		}

		case "number":
		case "range": {
			const numField = field as NumberField;
			if (numField.min !== undefined) {
				const schema = minSchema(numField.min);
				rules.push({
					validate: (v) => {
						if (v === undefined || v === null) return true;
						const result = schema(v);
						return !(result instanceof type.errors);
					},
					message: `Must be at least ${numField.min}`,
				});
			}
			if (numField.max !== undefined) {
				const schema = maxSchema(numField.max);
				rules.push({
					validate: (v) => {
						if (v === undefined || v === null) return true;
						const result = schema(v);
						return !(result instanceof type.errors);
					},
					message: `Must be at most ${numField.max}`,
				});
			}
			break;
		}

		case "file": {
			const fileField = field as FileField;
			if (fileField.maxSize !== undefined) {
				const maxSize = fileField.maxSize;
				rules.push({
					validate: (v) => {
						if (!v) return true;
						if (v instanceof File) return v.size <= maxSize;
						if (Array.isArray(v)) {
							return v.every((f) => f instanceof File && f.size <= maxSize);
						}
						return true;
					},
					message: `File must be smaller than ${formatFileSize(maxSize)}`,
				});
			}
			if (fileField.accept !== undefined) {
				const accept = fileField.accept;
				rules.push({
					validate: (v) => {
						if (!v) return true;
						const types = accept.split(",").map((t) => t.trim());
						const checkFile = (file: File) => {
							return types.some((type) => {
								if (type.startsWith(".")) {
									return file.name.toLowerCase().endsWith(type.toLowerCase());
								}
								if (type.includes("*")) {
									const pattern = type.replace("*", ".*");
									return new RegExp(pattern).test(file.type);
								}
								return file.type === type;
							});
						};
						if (v instanceof File) return checkFile(v);
						if (Array.isArray(v)) return v.every((f) => f instanceof File && checkFile(f));
						return true;
					},
					message: "Invalid file type",
				});
			}
			break;
		}
	}

	return rules;
};
