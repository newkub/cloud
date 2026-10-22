/** Calendar dropdown for `DateTimePicker` — positioned panel wrapping `CalendarGrid`. */
import { type ControlSize, type Radius, radiusMap } from "../../lib/variants";
import { CalendarGrid } from "../DatePicker";

export interface DateTimePickerDropdownProps {
	month: Date;
	onMonthChange: (d: Date) => void;
	selected?: string;
	minDate?: string;
	maxDate?: string;
	weekStartsOn?: 0 | 1;
	size?: ControlSize;
	radius?: Radius;
	onSelect: (iso: string) => void;
	onEscape: () => void;
}

export function DateTimePickerDropdown(props: DateTimePickerDropdownProps) {
	return (
		<div
			role="dialog"
			aria-label="Choose date"
			class={`absolute left-0 top-full z-dropdown mt-1 border border-border bg-surface p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[props.radius ?? "md"]}`}
		>
			<CalendarGrid
				month={props.month}
				onMonthChange={props.onMonthChange}
				selected={props.selected}
				minDate={props.minDate}
				maxDate={props.maxDate}
				weekStartsOn={props.weekStartsOn}
				size={props.size}
				radius={props.radius}
				onSelect={props.onSelect}
				onEscape={props.onEscape}
			/>
		</div>
	);
}
