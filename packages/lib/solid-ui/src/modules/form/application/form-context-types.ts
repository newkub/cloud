import type { Accessor } from "solid-js";
import type { FieldState, FieldValue, FormConfig, FormSubmission } from "../domain/models";

export interface FormContextValue {
	config: FormConfig;
	isValid: Accessor<boolean>;
	isDirty: Accessor<boolean>;
	isSubmitting: Accessor<boolean>;
	isSubmitted: Accessor<boolean>;
	submitCount: Accessor<number>;
	errors: Accessor<Record<string, string[]>>;
	getError: (name: string) => Accessor<string | null>;
	values: Accessor<Record<string, FieldValue>>;
	getValue: <T = FieldValue>(name: string) => Accessor<T | undefined>;
	getFieldState: (name: string) => Accessor<FieldState | undefined>;
	setValue: (name: string, value: FieldValue) => void;
	setError: (name: string, error: string | string[]) => void;
	clearError: (name: string) => void;
	reset: (name?: string) => void;
	validate: (name?: string) => boolean;
	submit: <T = Record<string, FieldValue>>(data?: T) => Promise<FormSubmission<T>>;
	focus: (name: string) => void;
	blur: (name: string) => void;
	disable: (name: string) => void;
	enable: (name: string) => void;
}

export interface FormProviderProps {
	config: FormConfig;
	children: unknown;
}
