import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../../lib/variants";

/** Quick-pick option rendered inside the dropdown. */
export interface DatePickerPreset {
	label: string;
	/** ISO date or a factory evaluated on click. */
	value: string | (() => string);
}

export interface DatePickerProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue" | "size"> {
	/** Controlled "YYYY-MM-DD" value. */
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	/** Visual style. @default "default" */
	variant?: InputVariant;
	/** Control size. @default "md" */
	size?: ControlSize;
	/** Called with the "YYYY-MM-DD" value — empty string when cleared. */
	onChange?: (value: string) => void;
	/** Earliest selectable date "YYYY-MM-DD" — typed values are clamped, days disabled in the grid. */
	minDate?: string;
	/** Latest selectable date "YYYY-MM-DD". */
	maxDate?: string;
	/** Display/parse format using tokens YYYY YY MMMM MMM MM M DD D. @default "YYYY-MM-DD" */
	valueFormat?: string;
	/** Controlled dropdown open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). @default false */
	defaultOpen?: boolean;
	/** Called when the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Show a × button that clears the value. */
	clearable?: boolean;
	/** Quick-pick options shown as a column inside the dropdown. */
	presets?: DatePickerPreset[];
	/** Outline today in the grid. @default true */
	highlightToday?: boolean;
	/** Mute weekend days in the grid. @default true */
	dimWeekends?: boolean;
	/** First day of the week: 0 = Sunday, 1 = Monday. @default 0 */
	weekStartsOn?: 0 | 1;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Error state — `true` for styling only, or a message rendered below the input. */
	error?: boolean | string;
	/** Optional field label rendered above the input. */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
}
