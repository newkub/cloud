/**
 * DatePickerDropdown — the popover panel of `DatePicker`: optional preset
 * column plus a `CalendarGrid` in a dialog.
 */
import { For, Show } from "solid-js";
import { type ControlSize, type Radius, radiusMap } from "../../lib/variants";
import { CalendarGrid } from "../CalendarGrid";
import type { DatePickerPreset } from "./types";

export interface DatePickerDropdownProps {
	/** Whether the dropdown is open. */
	open: boolean;
	/** Quick-pick options shown as a column inside the dropdown. */
	presets?: DatePickerPreset[];
	/** Called when a preset button is clicked. */
	onPreset: (preset: DatePickerPreset) => void;
	/** Viewed month (day ignored). */
	month: Date;
	onMonthChange: (month: Date) => void;
	/** Selected day as "YYYY-MM-DD". */
	selected?: string;
	minDate?: string;
	maxDate?: string;
	weekStartsOn?: 0 | 1;
	highlightToday?: boolean;
	dimWeekends?: boolean;
	size?: ControlSize;
	radius?: Radius;
	/** Called with the picked ISO day. */
	onSelect: (iso: string) => void;
	/** Called on Escape — the parent refocuses the input. */
	onEscape: () => void;
}

export function DatePickerDropdown(props: DatePickerDropdownProps) {
	return (
		<Show when={props.open}>
			<div
				role="dialog"
				aria-label="Choose date"
				class={`absolute left-0 top-full z-dropdown mt-1 flex gap-3 border border-border bg-surface p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[props.radius ?? "md"]}`}
			>
				<Show when={props.presets?.length}>
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
					selected={props.selected}
					minDate={props.minDate}
					maxDate={props.maxDate}
					weekStartsOn={props.weekStartsOn}
					highlightToday={props.highlightToday}
					dimWeekends={props.dimWeekends}
					size={props.size}
					radius={props.radius}
					onSelect={props.onSelect}
					onEscape={props.onEscape}
				/>
			</div>
		</Show>
	);
}
