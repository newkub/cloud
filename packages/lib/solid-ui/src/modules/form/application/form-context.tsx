// Form Context - SolidJS Context Provider
// Re-exports from form-context-types for compatibility

import { createContext } from "solid-js";
import type { FormContextValue, FormProviderProps } from "./form-context-types";

export const FormContext = createContext<FormContextValue>({} as FormContextValue);

export function FormProvider(props: FormProviderProps) {
	// Placeholder implementation - actual implementation would go in a separate file
	return props.children;
}

export type { FormContextValue, FormProviderProps } from "./form-context-types";
