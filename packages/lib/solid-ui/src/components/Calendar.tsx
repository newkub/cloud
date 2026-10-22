/**
 * Calendar - month grid for picking a date.
 */
import { createSignal, For, mergeProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-sm",
};

export interface CalendarProps {
	value?: Date;
	onChange?: (date: Date) => void;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildWeeks(viewDate: Date) {
	const offset = startOfMonth(viewDate).getDay();
	const total = daysInMonth(viewDate);
	const cells: (number | null)[] = [];
	for (let i = 0; i < offset; i++) cells.push(null);
	for (let i = 1; i <= total; i++) cells.push(i);
	const target = Math.ceil(cells.length / 7) * 7;
	while (cells.length < target) cells.push(null);
	const result: (number | null)[][] = [];
	for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
	return result;
}

function handleDayKeyDown(e: KeyboardEvent, day: number, total: number, baseId: string) {
	if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
	e.preventDefault();
	const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
	let next = day + (moves[e.key] ?? 0);
	if (next < 1) next = 1;
	if (next > total) next = total;
	const el = document.getElementById(`${baseId}-day-${next}`);
	el?.focus();
}

function CalendarHeader(props: { monthLabel: string; onPrev: () => void; onNext: () => void }) {
	return (
		<div class="mb-3 flex items-center justify-between">
			<button
				type="button"
				onClick={props.onPrev}
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				aria-label="Previous month"
			>
				‹
			</button>
			<span class="text-sm font-semibold">{props.monthLabel}</span>
			<button
				type="button"
				onClick={props.onNext}
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				aria-label="Next month"
			>
				›
			</button>
		</div>
	);
}

function CalendarDayButton(props: {
	day: number;
	baseId: string;
	view: () => Date;
	selected: () => Date;
	monthLabel: () => string;
	onSelect: (day: number) => void;
	onKeyDown: (e: KeyboardEvent, day: number) => void;
}) {
	const date = () => new Date(props.view().getFullYear(), props.view().getMonth(), props.day);
	const isSelected = () => isSameDay(props.selected(), date());
	const isToday = () => isSameDay(new Date(), date());
	return (
		<button
			type="button"
			id={`${props.baseId}-day-${props.day}`}
			onClick={() => props.onSelect(props.day)}
			onKeyDown={(e) => props.onKeyDown(e, props.day)}
			class={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
				isSelected()
					? "bg-primary text-primary-foreground"
					: isToday()
						? "border border-primary text-primary"
						: "text-foreground hover:bg-muted"
			}`}
			tabIndex={isSelected() ? 0 : -1}
			aria-label={`${props.monthLabel()} ${props.day}`}
			aria-pressed={isSelected()}
			aria-current={isToday() ? "date" : undefined}
		>
			{props.day}
		</button>
	);
}

function CalendarGrid(props: {
	weeks: () => (number | null)[][];
	baseId: string;
	view: () => Date;
	selected: () => Date;
	monthLabel: () => string;
	onSelect: (day: number) => void;
	onKeyDown: (e: KeyboardEvent, day: number) => void;
}) {
	return (
		<div class="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
			<For each={props.weeks()}>
				{(week) => (
					<For each={week}>
						{(day) =>
							day === null ? (
								<div />
							) : (
								<CalendarDayButton
									day={day}
									baseId={props.baseId}
									view={props.view}
									selected={props.selected}
									monthLabel={props.monthLabel}
									onSelect={props.onSelect}
									onKeyDown={props.onKeyDown}
								/>
							)
						}
					</For>
				)}
			</For>
		</div>
	);
}

let calendarCounter = 0;

export function Calendar(props: CalendarProps) {
	const merged = mergeProps({ value: new Date() }, props);
	const baseId = `calendar-${++calendarCounter}`;
	const [view, setView] = createSignal(merged.value);
	const [selected, setSelected] = createSignal(merged.value);

	const days = () => daysInMonth(view());
	const weeks = () => buildWeeks(view());

	function selectDate(d: number) {
		const date = new Date(view().getFullYear(), view().getMonth(), d);
		setSelected(date);
		setView(date);
		props.onChange?.(date);
	}

	function prevMonth() {
		setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
	}

	function nextMonth() {
		setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
	}

	const monthLabel = () => view().toLocaleDateString("en-US", { month: "long", year: "numeric" });

	const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const onDayKeyDown = (e: KeyboardEvent, day: number) => handleDayKeyDown(e, day, days(), baseId);

	return (
		<section
			class={`w-full border ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "md"]} ${radiusMap[merged.radius ?? "xl"]} ${merged.elevation ? elevationMap[merged.elevation] : ""} ${props.class ?? ""}`}
			aria-label="Calendar"
		>
			<CalendarHeader monthLabel={monthLabel()} onPrev={prevMonth} onNext={nextMonth} />
			<div class="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
				<For each={weekDays}>{(d) => <div aria-hidden="true">{d}</div>}</For>
			</div>
			<CalendarGrid
				weeks={weeks}
				baseId={baseId}
				view={view}
				selected={selected}
				monthLabel={monthLabel}
				onSelect={selectDate}
				onKeyDown={onDayKeyDown}
			/>
		</section>
	);
}
