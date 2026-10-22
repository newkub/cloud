import type { FieldValue as FieldValueModel, ValidationRule as ValidationRuleModel } from "../models";
/**
 * Create validation rule
 */
export declare const createRule: (validate: (value: FieldValueModel) => boolean, message: string) => ValidationRuleModel;
/**
 * Required validation
 */
export declare const required: (message?: string) => ValidationRuleModel;
/**
 * Min length validation
 */
export declare const minLength: (min: number, message?: string) => ValidationRuleModel;
/**
 * Max length validation
 */
export declare const maxLength: (max: number, message?: string) => ValidationRuleModel;
/**
 * Pattern validation
 */
export declare const pattern: (regex: RegExp, message?: string) => ValidationRuleModel;
/**
 * Email validation
 */
export declare const email: (message?: string) => ValidationRuleModel;
/**
 * Match validation
 */
export declare const match: (_otherField: string, message?: string) => ValidationRuleModel;
