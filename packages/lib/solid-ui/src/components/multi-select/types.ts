import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../../lib/variants";

export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Secondary line under the label. */
	description?: string;
}

export interface MultiSelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	options?: MultiSelectOption[];
	value?: string[];
	defaultValue?: string[];
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: string[]) => void;
	placeholder?: string;
	/** Disable the trigger. @default false */
	disabled?: boolean;
	/** Marks the control invalid — destructive border + `aria-invalid`. @default false */
	invalid?: boolean;
	/** Show a clear (×) button that empties the selection. @default false */
	clearable?: boolean;
	/** Accessible label for the clear button. @default "Clear selection" */
	clearLabel?: string;
	/** Called after the selection is cleared via the clear button. */
	onClear?: () => void;
	/** Render a search input inside the dropdown to filter options. @default false */
	searchable?: boolean;
	/** Placeholder for the search input. @default "Search…" */
	searchPlaceholder?: string;
	/** Text shown when no options match. @default "No results found." */
	emptyText?: string;
	/** Show a loading row instead of options while open. @default false */
	loading?: boolean;
	/** Text shown while `loading` is on. @default "Loading…" */
	loadingText?: string;
	/** Called whenever the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Custom option filter — defaults to case-insensitive label match. */
	filterOption?: (option: MultiSelectOption, query: string) => boolean;
	/** Maximum number of selectable options — further picks are ignored. */
	maxSelected?: number;
	triggerClass?: string;
	listClass?: string;
	/** Corner radius for the trigger and dropdown list. */
	radius?: Radius;
}
