/**
 * DateRangeDropdown — the popover panel of `DateRangePicker`: optional
 * preset column plus a range-enabled `CalendarGrid` in a dialog.
 */
import { For, Show } from "solid-js";
import { type ControlSize, type Radius, radiusMap } from "../../lib/variants";
import { CalendarGrid } from "../CalendarGrid";
import type { DateRangePreset } from "./types";

export interface DateRangeDropdownProps {
	/** Whether the dropdown is open. */
	open: boolean;
	/** Resolved quick-pick ranges shown as a column. */
	presets: DateRangePreset[];
	/** Called when a preset button is clicked. */
	onPreset: (preset: DateRangePreset) => void;
	/** Viewed month (day ignored). */
	month: Date;
	onMonthChange: (month: Date) => void;
	/** Inclusive range highlight — `rangeEnd` may be the hover preview. */
	rangeStart?: string;
	rangeEnd?: string;
	minDate?: string;
	maxDate?: string;
	weekStartsOn?: 0 | 1;
	highlightToday?: boolean;
	dimWeekends?: boolean;
	size?: ControlSize;
	radius?: Radius;
	/** Called with the clicked ISO day. */
	onSelect: (iso: string) => void;
	/** Called on day hover — drives the range preview. */
	onDayHover: (iso: string) => void;
	onEscape: () => void;
}

export function DateRangeDropdown(props: DateRangeDropdownProps) {
	return (
		<Show when={props.open}>
			<div
				role="dialog"
				aria-label="Choose date range"
				class={`absolute left-0 top-full z-dropdown mt-1 flex gap-3 border border-border bg-surface p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[props.radius ?? "md"]}`}
			>
				<Show when={props.presets.length}>
					<div class="flex w-28 flex-col gap-0.5 border-r border-border pr-2">
						<For each={props.presets}>
							{(p) => (
								<button
									type="button"
									class="rounded px-2 py-1 text-left text-xs text-foreground motion-safe:transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									onClick={() => props.onPreset(p)}
								>
									{p.label}
								</button>
							)}
						</For>
					</div>
				</Show>
				<CalendarGrid
					month={props.month}
					onMonthChange={props.onMonthChange}
					rangeStart={props.rangeStart}
					rangeEnd={props.rangeEnd}
					minDate={props.minDate}
					maxDate={props.maxDate}
					weekStartsOn={props.weekStartsOn}
					highlightToday={props.highlightToday}
					dimWeekends={props.dimWeekends}
					size={props.size}
					radius={props.radius}
					onSelect={props.onSelect}
					onDayHover={props.onDayHover}
					onEscape={props.onEscape}
					label="Date range"
				/>
			</div>
		</Show>
	);
}
