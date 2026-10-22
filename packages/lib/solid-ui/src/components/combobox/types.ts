import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../../lib/variants";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Secondary line under the label. */
	description?: string;
}

export interface ComboboxListOption extends ComboboxOption {
	/** Marks the "create" pseudo-option appended when `creatable` is on. */
	create?: boolean;
}

export interface ComboboxProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	options?: ComboboxOption[];
	value?: string;
	defaultValue?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	disabled?: boolean;
	/** Marks the input invalid — destructive border + `aria-invalid`. @default false */
	invalid?: boolean;
	/** Show a clear (×) button that resets the value to `""`. @default false */
	clearable?: boolean;
	/** Accessible label for the clear button. @default "Clear selection" */
	clearLabel?: string;
	/** Called after the value is cleared via the clear button. */
	onClear?: () => void;
	/** Show a loading row instead of options while open. @default false */
	loading?: boolean;
	/** Text shown while `loading` is on. @default "Loading…" */
	loadingText?: string;
	/** Called whenever the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Allow creating an option from free text when nothing matches. @default false */
	creatable?: boolean;
	/** Label factory for the create pseudo-option. @default (input) => `Create "${input}"` */
	createLabel?: (input: string) => string;
	/** Called when the user picks the create pseudo-option. */
	onCreateOption?: (input: string) => void;
	/** Custom option filter — defaults to case-insensitive label match. */
	filterOption?: (option: ComboboxOption, query: string) => boolean;
	inputClass?: string;
	listClass?: string;
	/** Corner radius for the input and dropdown list. @default "xl" for list */
	radius?: Radius;
}
