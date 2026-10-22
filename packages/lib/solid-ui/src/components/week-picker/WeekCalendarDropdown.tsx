import { type Radius, radiusMap } from "../../lib/variants";
import { CalendarGrid } from "../CalendarGrid";
import { toISODate } from "../date-helpers";
import type { WeekValue } from "./types";
import { weekStart } from "./week-utils";

export interface WeekCalendarDropdownProps {
	month: Date;
	onMonthChange: (month: Date) => void;
	value: WeekValue;
	minDate?: string;
	maxDate?: string;
	weekStartsOn?: 0 | 1;
	size?: "sm" | "md" | "lg";
	radius?: Radius;
	onSelect: (iso: string) => void;
	onEscape: () => void;
}

/** Popover calendar highlighting the full Mon–Sun week of `value`. */
export function WeekCalendarDropdown(props: WeekCalendarDropdownProps) {
	return (
		<div
			role="dialog"
			aria-label="Choose week"
			class={`absolute left-0 top-full z-dropdown mt-1 border border-border bg-surface p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[props.radius ?? "md"]}`}
		>
			<CalendarGrid
				month={props.month}
				onMonthChange={props.onMonthChange}
				highlightWeekOf={toISODate(weekStart(props.value.year, props.value.week))}
				minDate={props.minDate}
				maxDate={props.maxDate}
				weekStartsOn={props.weekStartsOn ?? 1}
				size={props.size}
				radius={props.radius}
				onSelect={props.onSelect}
				onEscape={props.onEscape}
				label="Week"
			/>
		</div>
	);
}
