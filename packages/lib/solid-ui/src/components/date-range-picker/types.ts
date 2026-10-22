import type { JSX } from "solid-js";
import type { ControlSize, InputVariant, Radius } from "../../lib/variants";

export interface DateRange {
	start: string;
	end: string;
}

/** Quick-pick option rendered inside the dropdown. */
export interface DateRangePreset {
	label: string;
	/** Range or a factory evaluated on click. */
	value: DateRange | (() => DateRange);
}

export interface DateRangePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled {start, end} of ISO "YYYY-MM-DD" strings. */
	value?: DateRange;
	/** Initial range (uncontrolled). */
	defaultValue?: DateRange;
	/** Visual style of the input frame. @default "default" */
	variant?: InputVariant;
	/** Control size. @default "md" */
	size?: ControlSize;
	/** Called whenever start or end changes — `end` may be "" while picking. */
	onChange?: (range: DateRange) => void;
	/** aria-label of the start input. @default "Start date" */
	startLabel?: string;
	/** aria-label of the end input. @default "End date" */
	endLabel?: string;
	/** Earliest selectable date — clamps typed values and disables grid days. */
	minDate?: string;
	/** Latest selectable date. */
	maxDate?: string;
	/** Controlled dropdown open state. */
	open?: boolean;
	/** Initial open state (uncontrolled). @default false */
	defaultOpen?: boolean;
	/** Called when the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Show a × button that resets start and end. */
	clearable?: boolean;
	/** Quick-pick ranges — pass `true` for {@link defaultRangePresets}. */
	presets?: DateRangePreset[] | true;
	/** Outline today in the grid. @default true */
	highlightToday?: boolean;
	/** Mute weekend days in the grid. @default true */
	dimWeekends?: boolean;
	/** First day of the week: 0 = Sunday, 1 = Monday. @default 0 */
	weekStartsOn?: 0 | 1;
	/** Read-only inputs — the dropdown stays closed. */
	readOnly?: boolean;
	/** Mark both inputs required. */
	required?: boolean;
	/** Disable the whole control. */
	disabled?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above the control. */
	label?: string;
	/** Form field name — renders a hidden input with value "start,end". */
	name?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}
