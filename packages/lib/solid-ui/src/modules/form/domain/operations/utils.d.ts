import type { FieldDef, FieldValue } from "../models";
export declare const formatFileSize: (bytes: number) => string;
export declare const deepEqual: (a: unknown, b: unknown) => boolean;
export declare const maybeTrim: (value: FieldValue, shouldTrim?: boolean) => FieldValue;
export declare const coerceValue: (value: FieldValue, type: FieldDef["type"]) => FieldValue;
export declare const getFirstError: (errors: Record<string, string[]>) => string | null;
export declare const hasErrors: (errors: Record<string, string[]>) => boolean;
