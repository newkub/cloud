import type { FieldDef, FieldValue, ValidationResult, ValidationRule } from "../models";
export declare const isRequired: (_field: FieldDef) => boolean;
export declare const validateField: (value: FieldValue, field: FieldDef, rules: ValidationRule[]) => ValidationResult;
