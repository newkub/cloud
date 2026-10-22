/**
 * WeekPicker — pick an ISO week (year + week number) with prev/next stepping
 * and an optional dropdown calendar that highlights the whole week. ISO week
 * math lives in `./week-picker/week-utils` and is re-exported here.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, Show, splitProps } from "solid-js";
import { inputVariants, radiusMap } from "../lib/variants";
import { parseISODate, toISODate } from "./date-helpers";
import { CalendarIcon, ClearIcon } from "./date-picker/shared";
import { ctrl } from "./week-picker/styles";
import type { WeekPickerProps, WeekValue } from "./week-picker/types";
import { WeekCalendarDropdown } from "./week-picker/WeekCalendarDropdown";
import { WeekStepButton } from "./week-picker/WeekStepButton";
import { isoWeek, weekStart, weeksInYear } from "./week-picker/week-utils";

export type { WeekPickerProps, WeekValue } from "./week-picker/types";
export { isoWeek, weekStart, weeksInYear } from "./week-picker/week-utils";

export function WeekPicker(props: WeekPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"showRange",
		"minDate",
		"maxDate",
		"open",
		"defaultOpen",
		"onOpenChange",
		"clearable",
		"onClear",
		"weekStartsOn",
		"readOnly",
		"error",
		"label",
		"name",
		"variant",
		"size",
		"radius",
		"disabled",
		"fullWidth",
	]);

	const initialWeek = local.defaultValue ?? local.value ?? isoWeek(new Date());
	const [internal, setInternal] = createSignal<WeekValue>(initialWeek);
	const [openInternal, setOpenInternal] = createSignal(local.defaultOpen ?? false);
	const [view, setView] = createSignal<Date>(weekStart(initialWeek.year, initialWeek.week));
	let root: HTMLDivElement | undefined;

	const v = () => local.value ?? internal();
	const open = () => (local.open !== undefined ? local.open : openInternal());
	const setOpen = (next: boolean) => {
		if (local.disabled || local.readOnly) return;
		setOpenInternal(next);
		local.onOpenChange?.(next);
	};

	/** A week is allowed when its Mon–Sun span intersects [minDate, maxDate]. */
	const weekAllowed = (w: WeekValue) => {
		const monday = toISODate(weekStart(w.year, w.week));
		const sunday = toISODate(
			new Date(
				Date.UTC(
					weekStart(w.year, w.week).getUTCFullYear(),
					weekStart(w.year, w.week).getUTCMonth(),
					weekStart(w.year, w.week).getUTCDate() + 6,
				),
			),
		);
		if (local.maxDate && monday > local.maxDate.slice(0, 10)) return false;
		if (local.minDate && sunday < local.minDate.slice(0, 10)) return false;
		return true;
	};

	const commit = (next: WeekValue) => {
		if (!weekAllowed(next)) return;
		setInternal(next);
		local.onChange?.(next);
	};

	/** Week reached by stepping `dir` from the current value (wrapping years). */
	const stepped = (dir: 1 | -1): WeekValue => {
		let { year, week } = v();
		week += dir;
		if (week < 1) {
			year -= 1;
			week = weeksInYear(year);
		} else if (week > weeksInYear(year)) {
			year += 1;
			week = 1;
		}
		return { year, week };
	};

	const move = (dir: 1 | -1) => commit(stepped(dir));

	const pickDay = (iso: string) => {
		const d = parseISODate(iso);
		if (!d) return;
		commit(isoWeek(d));
		setOpen(false);
	};

	const clear = () => {
		const now = isoWeek(new Date());
		setInternal(now);
		local.onChange?.(now);
		local.onClear?.();
	};

	const range = () => {
		const start = weekStart(v().year, v().week);
		const end = new Date(start);
		end.setUTCDate(start.getUTCDate() + 6);
		const fmt = (d: Date) => d.toISOString().slice(0, 10);
		return `${fmt(start)} → ${fmt(end)}`;
	};

	useClickOutside(
		() => root,
		() => setOpen(false),
		{ enabled: open },
	);
	useEscapeKey(() => setOpen(false), { when: open });

	return (
		<div
			ref={root}
			class={`solidui-week-picker relative ${local.fullWidth ? "w-full" : "inline-flex"} flex-col gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<span class="text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			<div class="flex items-center gap-1">
				<WeekStepButton
					dir={-1}
					label="Previous week"
					size={local.size}
					disabled={local.disabled || local.readOnly || !weekAllowed(stepped(-1))}
					onClick={() => move(-1)}
				/>
				<div
					class={`inline-flex items-center gap-1 border bg-surface px-2 font-mono tabular-nums text-foreground focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${ctrl[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""}`}
					aria-invalid={local.error ? true : undefined}
				>
					<input
						type="number"
						value={v().year}
						disabled={local.disabled}
						readOnly={local.readOnly}
						aria-label="Year"
						class="w-12 border-0 bg-transparent text-center focus-visible:outline-none disabled:opacity-50"
						onInput={(e) => {
							const y = Number(e.currentTarget.value);
							if (y >= 1970 && y <= 9999) commit({ year: y, week: Math.min(v().week, weeksInYear(y)) });
						}}
					/>
					<span class="text-muted-foreground">W</span>
					<input
						type="number"
						min={1}
						max={weeksInYear(v().year)}
						value={v().week}
						disabled={local.disabled}
						readOnly={local.readOnly}
						aria-label="Week"
						class="w-8 border-0 bg-transparent text-center focus-visible:outline-none disabled:opacity-50"
						onInput={(e) => {
							const w = Number(e.currentTarget.value);
							if (w >= 1 && w <= weeksInYear(v().year)) commit({ year: v().year, week: w });
						}}
					/>
					<button
						type="button"
						aria-label={open() ? "Close calendar" : "Open calendar"}
						aria-haspopup="dialog"
						aria-expanded={open()}
						disabled={local.disabled || local.readOnly}
						class="ml-1 flex h-5 w-5 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
						onClick={() => {
							setView(weekStart(v().year, v().week));
							setOpen(!open());
						}}
					>
						<CalendarIcon class="h-3.5 w-3.5" />
					</button>
				</div>
				<WeekStepButton
					dir={1}
					label="Next week"
					size={local.size}
					disabled={local.disabled || local.readOnly || !weekAllowed(stepped(1))}
					onClick={() => move(1)}
				/>
				<Show when={local.clearable && !local.disabled && !local.readOnly}>
					<button
						type="button"
						aria-label="Reset to current week"
						class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={clear}
					>
						<ClearIcon />
					</button>
				</Show>
			</div>
			<Show when={local.name}>
				<input type="hidden" name={local.name} value={`${v().year}-W${String(v().week).padStart(2, "0")}`} />
			</Show>
			{(local.showRange ?? true) && <span class="text-center font-mono text-2xs text-muted-foreground">{range()}</span>}
			<Show when={open()}>
				<WeekCalendarDropdown
					month={view()}
					onMonthChange={setView}
					value={v()}
					minDate={local.minDate}
					maxDate={local.maxDate}
					weekStartsOn={local.weekStartsOn}
					size={local.size}
					radius={local.radius}
					onSelect={pickDay}
					onEscape={() => setOpen(false)}
				/>
			</Show>
			<Show when={typeof local.error === "string" && local.error}>
				<p role="alert" class="text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
