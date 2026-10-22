import type { FieldDef, FieldValue, FormConfig, FormSubmission } from "../domain/models";
export interface FormManager {
    readonly config: FormConfig;
    readonly isValid: boolean;
    readonly isDirty: boolean;
    setValue: (name: string, value: FieldValue) => void;
    getValue: (name: string) => FieldValue;
    setError: (name: string, error: string) => void;
    clearError: (name: string) => void;
    reset: (name?: string) => void;
    validate: (name?: string) => boolean;
    submit: () => Promise<FormSubmission>;
}
export interface FieldAdapter {
    readonly name: string;
    readonly type: FieldDef["type"];
    getValue: () => FieldValue;
    setValue: (value: FieldValue) => void;
    getError: () => string | null;
    setError: (error: string) => void;
    focus: () => void;
    blur: () => void;
}
export interface Validator {
    name: string;
    validate: (value: FieldValue, ...args: unknown[]) => boolean;
    message: string;
}
export interface FormPersistence {
    save: (values: Record<string, FieldValue>) => Promise<void>;
    load: () => Promise<Record<string, FieldValue> | null>;
    clear: () => Promise<void>;
}
export interface FormSubmitter {
    submit: (values: Record<string, FieldValue>) => Promise<void>;
    onError?: (error: Error) => void;
}
export interface AsyncValidator {
    validate: (value: FieldValue) => Promise<{
        valid: boolean;
        message?: string;
    }>;
}
