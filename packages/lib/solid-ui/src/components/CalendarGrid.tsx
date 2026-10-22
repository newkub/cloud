/**
 * CalendarGrid — reusable month grid with full keyboard navigation.
 * Shared by DatePicker, DateRangePicker, WeekPicker and DateTimePicker.
 * Grid math helpers live in `./calendar-grid/shared`.
 */
import { createMemo, createSignal, For } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { cellSize, monthCells, navBtn, startOfWeekISO, weekdayLabels, weekRangeOf } from "./calendar-grid/shared";
import { addDaysISO, addMonthsISO, formatISODate, MONTH_LONG, parseISODate, todayISO } from "./date-helpers";

export interface CalendarGridProps {
	/** Viewed month (day ignored) — controlled. */
	month: Date;
	/** Called when the viewed month should change (nav buttons or arrow keys). */
	onMonthChange: (d: Date) => void;
	/** Selected day as "YYYY-MM-DD" — highlighted. */
	selected?: string;
	/** Inclusive range highlight (ISO strings). */
	rangeStart?: string;
	rangeEnd?: string;
	/** Highlight the whole Mon–Sun week containing this ISO date. */
	highlightWeekOf?: string;
	/** Days outside [minDate, maxDate] are disabled. */
	minDate?: string;
	maxDate?: string;
	/** First column of the grid: 0 = Sunday, 1 = Monday. @default 0 */
	weekStartsOn?: 0 | 1;
	/** Outline today's date. @default true */
	highlightToday?: boolean;
	/** Mute Saturday/Sunday cells. @default true */
	dimWeekends?: boolean;
	/** Disable every day button. */
	disabled?: boolean;
	/** Cell size. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius on day cells. */
	radius?: Radius;
	/** Called with the ISO day on click / Enter. */
	onSelect: (iso: string) => void;
	/** Called on hover over a day (range preview). */
	onDayHover?: (iso: string) => void;
	/** Called on Escape — parents usually close the dropdown. */
	onEscape?: () => void;
	/** aria-label of the grid. @default "Calendar" */
	label?: string;
}

export function CalendarGrid(props: CalendarGridProps) {
	let root: HTMLDivElement | undefined;
	const weekStartsOn = () => props.weekStartsOn ?? 0;
	const month = () => props.month ?? new Date();
	const min = () => props.minDate?.slice(0, 10);
	const max = () => props.maxDate?.slice(0, 10);
	const [cursor, setCursor] = createSignal(props.selected || props.rangeStart || todayISO());

	const cells = createMemo(() => monthCells(month(), weekStartsOn()));
	const weekdayLabelList = createMemo(() => weekdayLabels(weekStartsOn()));

	/** Mon–Sun ISO bounds of the week containing highlightWeekOf. */
	const weekRange = createMemo((): [string, string] | null => weekRangeOf(props.highlightWeekOf));

	const dayDisabled = (iso: string) =>
		props.disabled ||
		(min() !== undefined && iso < (min() as string)) ||
		(max() !== undefined && iso > (max() as string));
	const inMonth = (iso: string) => {
		const d = parseISODate(iso);
		return d !== null && d.getMonth() === month().getMonth() && d.getFullYear() === month().getFullYear();
	};
	const inRange = (iso: string) => {
		const s = props.rangeStart;
		const e = props.rangeEnd;
		return s !== undefined && e !== undefined && s !== "" && e !== "" && iso > s && iso < e;
	};
	const isEdge = (iso: string) => iso === props.rangeStart || (props.rangeEnd !== "" && iso === props.rangeEnd);
	const inWeek = (iso: string) => {
		const w = weekRange();
		return w !== null && iso >= w[0] && iso <= w[1];
	};

	const focusDay = (iso: string) => {
		queueMicrotask(() => root?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus());
	};

	/** Move the roving focus cursor; follows into adjacent months when needed. */
	const moveCursor = (iso: string) => {
		setCursor(iso);
		const d = parseISODate(iso);
		if (d && (d.getMonth() !== month().getMonth() || d.getFullYear() !== month().getFullYear())) {
			props.onMonthChange(new Date(d.getFullYear(), d.getMonth(), 1));
		}
		focusDay(iso);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const cur = cursor();
		let next: string | null = null;
		switch (e.key) {
			case "ArrowLeft":
				next = addDaysISO(cur, -1);
				break;
			case "ArrowRight":
				next = addDaysISO(cur, 1);
				break;
			case "ArrowUp":
				next = addDaysISO(cur, -7);
				break;
			case "ArrowDown":
				next = addDaysISO(cur, 7);
				break;
			case "Home":
				next = startOfWeekISO(cur, weekStartsOn());
				break;
			case "End":
				next = addDaysISO(startOfWeekISO(cur, weekStartsOn()), 6);
				break;
			case "PageUp":
				next = addMonthsISO(cur, e.shiftKey ? -12 : -1);
				break;
			case "PageDown":
				next = addMonthsISO(cur, e.shiftKey ? 12 : 1);
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				if (!dayDisabled(cur)) props.onSelect(cur);
				return;
			case "Escape":
				props.onEscape?.();
				return;
			default:
				return;
		}
		e.preventDefault();
		moveCursor(next);
	};

	const shiftMonth = (n: number) => {
		const m = new Date(month().getFullYear(), month().getMonth() + n, 1);
		props.onMonthChange(m);
	};

	const dayClass = (iso: string) => {
		const d = parseISODate(iso);
		const weekend = d !== null && (d.getDay() === 0 || d.getDay() === 6);
		const selected = iso === props.selected || isEdge(iso);
		const ranged = inRange(iso) || inWeek(iso);
		const today = (props.highlightToday ?? true) && iso === todayISO();
		const outside = !inMonth(iso);
		const dimmed = (props.dimWeekends ?? true) && weekend;
		return [
			"flex items-center justify-center motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			cellSize[props.size ?? "md"],
			radiusMap[props.radius ?? "md"],
			dayDisabled(iso) ? "cursor-not-allowed opacity-40" : "cursor-pointer",
			selected
				? "bg-primary text-primary-foreground"
				: ranged
					? "bg-primary/15 text-foreground"
					: outside
						? "text-muted-foreground/50 hover:bg-muted"
						: dimmed
							? "text-muted-foreground hover:bg-muted"
							: "text-foreground hover:bg-muted",
			today && !selected ? "font-semibold text-primary ring-1 ring-inset ring-primary" : "",
		]
			.filter(Boolean)
			.join(" ");
	};

	return (
		<div ref={root} class="select-none">
			<div class="mb-2 flex items-center justify-between">
				<button
					type="button"
					class={navBtn}
					aria-label="Previous month"
					disabled={props.disabled}
					onClick={() => shiftMonth(-1)}
				>
					‹
				</button>
				<span class="text-sm font-semibold" aria-live="polite">
					{MONTH_LONG[month().getMonth()]} {month().getFullYear()}
				</span>
				<button
					type="button"
					class={navBtn}
					aria-label="Next month"
					disabled={props.disabled}
					onClick={() => shiftMonth(1)}
				>
					›
				</button>
			</div>
			<div class="grid grid-cols-7 gap-0.5 text-center text-2xs text-muted-foreground" aria-hidden="true">
				<For each={weekdayLabelList()}>{(d) => <div class="py-0.5">{d}</div>}</For>
			</div>
			<div role="listbox" aria-label={props.label ?? "Calendar"} class="grid grid-cols-7 gap-0.5" onKeyDown={onKeyDown}>
				<For each={cells()}>
					{(iso) => {
						const d = parseISODate(iso);
						return (
							<button
								type="button"
								role="option"
								data-date={iso}
								disabled={dayDisabled(iso)}
								tabIndex={cursor() === iso ? 0 : -1}
								aria-selected={iso === props.selected || isEdge(iso) || undefined}
								aria-current={iso === todayISO() ? "date" : undefined}
								aria-label={formatISODate(iso, "MMMM D, YYYY")}
								class={dayClass(iso)}
								onClick={() => props.onSelect(iso)}
								onMouseEnter={() => props.onDayHover?.(iso)}
							>
								{d?.getDate()}
							</button>
						);
					}}
				</For>
			</div>
		</div>
	);
}
