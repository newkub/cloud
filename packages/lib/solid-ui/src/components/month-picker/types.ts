import type { JSX } from "solid-js";
import type { InputVariant, Radius } from "../../lib/variants";

export interface MonthPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled "YYYY-MM" value. */
	value?: string;
	/** Initial "YYYY-MM" value (uncontrolled). */
	defaultValue?: string;
	/** Grid/trigger size. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Called with "YYYY-MM" — empty string when cleared. */
	onChange?: (value: string) => void;
	/** Earliest selectable month ("YYYY-MM" or "YYYY-MM-DD"). */
	minDate?: string;
	/** Latest selectable month ("YYYY-MM" or "YYYY-MM-DD"). */
	maxDate?: string;
	/** Render an input trigger and put the grid in a dropdown. @default false */
	dropdown?: boolean;
	/** Controlled dropdown open state (dropdown mode). */
	open?: boolean;
	/** Initial open state (uncontrolled, dropdown mode). @default false */
	defaultOpen?: boolean;
	/** Called when the dropdown opens or closes (dropdown mode). */
	onOpenChange?: (open: boolean) => void;
	/** Show a × button clearing the value (dropdown mode). */
	clearable?: boolean;
	/** Trigger placeholder / display format tokens (YYYY MMMM MMM MM M). @default "MMM YYYY" */
	valueFormat?: string;
	/** Trigger placeholder text shown when empty. */
	placeholder?: string;
	/** Visual style of the frame/trigger. @default "default" */
	variant?: InputVariant;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above (dropdown mode). */
	label?: string;
	/** Form field name — renders a hidden input with the "YYYY-MM" value. */
	name?: string;
	/** Read-only — typing and selection are blocked. */
	readOnly?: boolean;
	/** Mark the trigger required (dropdown mode). */
	required?: boolean;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}
