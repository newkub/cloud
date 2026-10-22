// Form Config - Form configuration types

import type { FieldDef } from "./field-definitions";

export interface FormConfig {
	id?: string;
	name?: string;
	fields: FieldDef[];
	validateOn?: "blur" | "change" | "submit" | "all";
	resetOnSubmit?: boolean;
	clearOnSubmit?: boolean;
	preventInvalidSubmit?: boolean;
}
