/**
 * RangeCalendar — two-month grid for picking a [start, end] date range with
 * hover preview, keyboard navigation and min/max bounds.
 */
import { createSignal, For } from "solid-js";

export interface CalendarRange {
	start?: Date;
	end?: Date;
}

export interface RangeCalendarProps {
	/** Initial range start — alias for `defaultValue.start`. */
	start?: Date;
	/** Initial range end — alias for `defaultValue.end`. */
	end?: Date;
	/** Controlled range — accepts a plain object or an accessor. */
	value?: CalendarRange | (() => CalendarRange);
	/** Initial uncontrolled range. */
	defaultValue?: CalendarRange;
	/** Called with the committed (or cleared) range. */
	onChange?: (range: CalendarRange) => void;
	/** Earliest selectable date (inclusive). */
	min?: Date;
	/** Latest selectable date (inclusive). */
	max?: Date;
	/** BCP 47 locale for month labels. @default "en-US" */
	locale?: string;
	class?: string;
}

const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

function buildWeeks(view: Date) {
	const offset = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
	const total = daysInMonth(view);
	const cells: (number | null)[] = Array.from({ length: offset }, () => null);
	for (let i = 1; i <= total; i++) cells.push(i);
	while (cells.length % 7 !== 0) cells.push(null);
	const weeks: (number | null)[][] = [];
	for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
	return weeks;
}

let rcCounter = 0;
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function RangeCalendar(props: RangeCalendarProps) {
	const baseId = `range-calendar-${++rcCounter}`;
	const [internal, setInternal] = createSignal<CalendarRange>(
		props.defaultValue ?? {
			start: props.start,
			end: props.end,
		},
	);
	const shown = (): CalendarRange => (typeof props.value === "function" ? props.value() : (props.value ?? internal()));
	const [pending, setPending] = createSignal<Date | undefined>(undefined);
	const [hover, setHover] = createSignal<Date | undefined>(undefined);
	const first = shown().start ?? new Date();
	const [view, setView] = createSignal(new Date(first.getFullYear(), first.getMonth(), 1));

	const blocked = (d: Date) =>
		(props.min !== undefined && midnight(d) < midnight(props.min)) ||
		(props.max !== undefined && midnight(d) > midnight(props.max));

	const emit = (r: CalendarRange) => {
		setInternal(r);
		props.onChange?.(r);
	};

	const select = (date: Date) => {
		if (blocked(date)) return;
		const p = pending();
		if (!p) {
			setPending(date);
			emit({});
			return;
		}
		const next = midnight(date) < midnight(p) ? { start: date, end: p } : { start: p, end: date };
		setPending(undefined);
		setHover(undefined);
		emit(next);
	};

	const rangeState = (date: Date): "endpoint" | "in-range" | "none" => {
		const t = midnight(date);
		const p = pending();
		const h = hover();
		const r = shown();
		if (p && h && !r.start) {
			const lo = Math.min(midnight(p), midnight(h));
			const hi = Math.max(midnight(p), midnight(h));
			if (t === lo || t === hi) return "endpoint";
			if (t > lo && t < hi) return "in-range";
		}
		if (p && midnight(p) === t) return "endpoint";
		const start = r.start ? midnight(r.start) : undefined;
		const end = r.end ? midnight(r.end) : undefined;
		if ((start !== undefined && t === start) || (end !== undefined && t === end)) return "endpoint";
		if (start !== undefined && end !== undefined && t > start && t < end) return "in-range";
		return "none";
	};

	const onKeyDown = (e: KeyboardEvent, day: number, monthIdx: number, month: Date) => {
		if (e.key === "Escape") {
			setPending(undefined);
			setHover(undefined);
			return;
		}
		const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
		if (!(e.key in moves)) return;
		e.preventDefault();
		const next = Math.min(daysInMonth(month), Math.max(1, day + moves[e.key]));
		document.getElementById(`${baseId}-${monthIdx}-${next}`)?.focus();
	};

	const MonthGrid = (mp: { monthIdx: number; date: Date }) => {
		const label = () => mp.date.toLocaleDateString(props.locale ?? "en-US", { month: "long", year: "numeric" });
		const dayOf = (day: number) => new Date(mp.date.getFullYear(), mp.date.getMonth(), day);
		return (
			// biome-ignore lint/a11y/useSemanticElements: APG calendar uses role="grid" on divs
			<div role="grid" aria-label={label()} class="w-56 select-none">
				<div class="mb-2 text-center text-sm font-semibold text-foreground">{label()}</div>
				{/* biome-ignore lint/a11y/useSemanticElements: weekday header labels, not table cells */}
				{/* biome-ignore lint/a11y/useFocusableInteractive: header row carries no handlers; cells are focusable buttons */}
				<div role="row" class="mb-1 grid grid-cols-7 text-center text-xs text-muted-foreground">
					<For each={WEEK_DAYS}>{(d) => <div aria-hidden="true">{d}</div>}</For>
				</div>
				<For each={buildWeeks(mp.date)}>
					{(week) => (
						// biome-ignore lint/a11y/useSemanticElements: grid row cells are buttons, not table data
						// biome-ignore lint/a11y/useFocusableInteractive: row wraps button cells; grid navigation is handled at the grid level
						<div role="row" class="grid grid-cols-7 gap-0.5">
							<For each={week}>
								{(day) =>
									day === null ? (
										<div aria-hidden="true" class="h-8 w-8" />
									) : (
										// biome-ignore lint/a11y/useSemanticElements: APG calendar date cell
										<button
											type="button"
											role="gridcell"
											id={`${baseId}-${mp.monthIdx}-${day}`}
											aria-selected={rangeState(dayOf(day)) !== "none"}
											data-range={rangeState(dayOf(day)) === "in-range" ? "true" : undefined}
											data-endpoint={rangeState(dayOf(day)) === "endpoint" ? "true" : undefined}
											disabled={blocked(dayOf(day))}
											class={`h-8 w-8 rounded-md text-xs motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 ${
												rangeState(dayOf(day)) === "endpoint"
													? "bg-primary text-primary-foreground"
													: rangeState(dayOf(day)) === "in-range"
														? "bg-primary/10 text-foreground"
														: "text-foreground hover:bg-muted"
											}`}
											onClick={() => select(dayOf(day))}
											onMouseEnter={() => setHover(dayOf(day))}
											onKeyDown={(e) => onKeyDown(e, day, mp.monthIdx, mp.date)}
										>
											{day}
										</button>
									)
								}
							</For>
						</div>
					)}
				</For>
			</div>
		);
	};

	return (
		<section
			class={`solidui-range-calendar inline-flex gap-6 rounded-lg border border-border bg-surface p-4 ${props.class ?? ""}`}
			aria-label="Date range"
		>
			<div class="flex items-center gap-2">
				<button
					type="button"
					aria-label="Previous month"
					class="h-8 w-8 rounded-md border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={() => setView((v) => addMonths(v, -1))}
				>
					‹
				</button>
				<button
					type="button"
					aria-label="Next month"
					class="h-8 w-8 rounded-md border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={() => setView((v) => addMonths(v, 1))}
				>
					›
				</button>
			</div>
			<MonthGrid monthIdx={0} date={view()} />
			<MonthGrid monthIdx={1} date={addMonths(view(), 1)} />
		</section>
	);
}
