// Form Validators Registry - Pure validation functions

import type { FieldValue, ValidatorDef } from "../models";

export const validators: Record<string, ValidatorDef> = {
	required: {
		name: "required",
		fn: (value: FieldValue) => {
			if (value === undefined || value === null || value === "") return false;
			if (Array.isArray(value) && value.length === 0) return false;
			if (value instanceof File && value.size === 0) return false;
			return true;
		},
		message: "This field is required",
	},

	email: {
		name: "email",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(value);
		},
		message: "Please enter a valid email address",
	},

	minLength: {
		name: "minLength",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (!value) return true;
			const min = args[0] as number;
			if (typeof value === "string") return value.length >= min;
			if (Array.isArray(value)) return value.length >= min;
			return true;
		},
		message: "Value is too short",
	},

	maxLength: {
		name: "maxLength",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (!value) return true;
			const max = args[0] as number;
			if (typeof value === "string") return value.length <= max;
			if (Array.isArray(value)) return value.length <= max;
			return true;
		},
		message: "Value is too long",
	},

	min: {
		name: "min",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (value === undefined || value === null) return true;
			const min = args[0] as number;
			if (typeof value === "number") return value >= min;
			if (typeof value === "string") {
				const num = parseFloat(value);
				return !Number.isNaN(num) && num >= min;
			}
			return true;
		},
		message: "Value is too small",
	},

	max: {
		name: "max",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (value === undefined || value === null) return true;
			const max = args[0] as number;
			if (typeof value === "number") return value <= max;
			if (typeof value === "string") {
				const num = parseFloat(value);
				return !Number.isNaN(num) && num <= max;
			}
			return true;
		},
		message: "Value is too large",
	},

	pattern: {
		name: "pattern",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			const pattern = args[0] as string | RegExp;
			const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
			return regex.test(value);
		},
		message: "Invalid format",
	},

	url: {
		name: "url",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		message: "Please enter a valid URL",
	},

	tel: {
		name: "tel",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
			return phoneRegex.test(value);
		},
		message: "Please enter a valid phone number",
	},

	maxSize: {
		name: "maxSize",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (!value) return true;
			const maxSize = args[0] as number;
			if (value instanceof File) return value.size <= maxSize;
			if (Array.isArray(value)) {
				return value.every((f) => f instanceof File && f.size <= maxSize);
			}
			return true;
		},
		message: "File is too large",
	},

	fileType: {
		name: "fileType",
		fn: (value: FieldValue, ...args: unknown[]) => {
			if (!value) return true;
			const types = args[0] as string | string[];
			const allowedTypes = Array.isArray(types) ? types : types.split(",").map((t) => t.trim());

			const checkFile = (file: File) => {
				return allowedTypes.some((type) => {
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

			if (value instanceof File) return checkFile(value);
			if (Array.isArray(value)) return value.every((f) => f instanceof File && checkFile(f));
			return true;
		},
		message: "Invalid file type",
	},

	integer: {
		name: "integer",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value === "number") return Number.isInteger(value);
			if (typeof value === "string") {
				const num = parseFloat(value);
				return !Number.isNaN(num) && Number.isInteger(num);
			}
			return true;
		},
		message: "Please enter a whole number",
	},

	positive: {
		name: "positive",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value === "number") return value > 0;
			if (typeof value === "string") {
				const num = parseFloat(value);
				return !Number.isNaN(num) && num > 0;
			}
			return true;
		},
		message: "Please enter a positive number",
	},

	alphanumeric: {
		name: "alphanumeric",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			return /^[a-zA-Z0-9]+$/.test(value);
		},
		message: "Only letters and numbers are allowed",
	},

	alpha: {
		name: "alpha",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			return /^[a-zA-Z]+$/.test(value);
		},
		message: "Only letters are allowed",
	},

	numeric: {
		name: "numeric",
		fn: (value: FieldValue) => {
			if (!value) return true;
			if (typeof value !== "string") return false;
			return /^[0-9]+$/.test(value);
		},
		message: "Only numbers are allowed",
	},
};
