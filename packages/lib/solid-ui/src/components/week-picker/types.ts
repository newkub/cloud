import type { JSX } from "solid-js";
import type { InputVariant, Radius } from "../../lib/variants";

export interface WeekValue {
	year: number;
	/** ISO week 1–53. */
	week: number;
}

export interface WeekPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled week. */
	value?: WeekValue;
	/** Initial week (uncontrolled) — defaults to the current ISO week. */
	defaultValue?: WeekValue;
	onChange?: (week: WeekValue) => void;
	/** Show the Monday–Sunday range below. @default true */
	showRange?: boolean;
	/** Earliest week — the week's Monday–Sunday must intersect this ISO date. */
	minDate?: string;
	/** Latest week. */
	maxDate?: string;
	/** Controlled dropdown open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). @default false */
	defaultOpen?: boolean;
	/** Called when the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Show a × button that resets to the current week and calls {@link onClear}. */
	clearable?: boolean;
	/** Called after a clear. */
	onClear?: () => void;
	/** First day of the week in the dropdown grid: 0 = Sunday, 1 = Monday. @default 1 */
	weekStartsOn?: 0 | 1;
	/** Read-only — stepping, typing and the dropdown are blocked. */
	readOnly?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above. */
	label?: string;
	/** Form field name — renders a hidden input with the ISO week value "YYYY-Www". */
	name?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	disabled?: boolean;
}
