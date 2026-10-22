/**
 * DateRangePicker — paired start/end inputs plus a dropdown range calendar
 * with hover preview and optional quick-pick presets.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, createUniqueId, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type ControlSize, inputVariants, radiusMap } from "../lib/variants";
import { parseISODate } from "./date-helpers";
import { CalendarIcon, ClearIcon, pickerIconBtn } from "./date-picker/shared";
import { DateRangeDropdown } from "./date-range-picker/DateRangeDropdown";
import { defaultRangePresets } from "./date-range-picker/presets";
import { clampRangeEnd, clampRangeStart, rangeEndMin, rangeStartMax } from "./date-range-picker/range-utils";
import type { DateRange, DateRangePickerProps, DateRangePreset } from "./date-range-picker/types";

export { defaultRangePresets } from "./date-range-picker/presets";
export type { DateRange, DateRangePickerProps, DateRangePreset } from "./date-range-picker/types";

const sizeMap: Record<ControlSize, string> = {
	sm: "p-1.5",
	md: "p-2",
	lg: "p-3",
};

export function DateRangePicker(props: DateRangePickerProps) {
	const merged = mergeProps({ defaultValue: { start: "", end: "" } }, props);
	const [internal, setInternal] = createSignal<DateRange>(merged.defaultValue);
	const uid = createUniqueId();
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"value",
		"defaultValue",
		"onChange",
		"startLabel",
		"endLabel",
		"minDate",
		"maxDate",
		"open",
		"defaultOpen",
		"onOpenChange",
		"clearable",
		"presets",
		"highlightToday",
		"dimWeekends",
		"weekStartsOn",
		"readOnly",
		"required",
		"disabled",
		"error",
		"label",
		"name",
		"radius",
		"fullWidth",
	]);

	let root: HTMLDivElement | undefined;
	const value = () => local.value ?? internal();
	const setValue = (next: DateRange) => {
		setInternal(next);
		local.onChange?.(next);
	};

	const [openInternal, setOpenInternal] = createSignal(local.defaultOpen ?? false);
	const open = () => (local.open !== undefined ? local.open : openInternal());
	const setOpen = (next: boolean) => {
		if (local.disabled || local.readOnly) return;
		setOpenInternal(next);
		local.onOpenChange?.(next);
	};

	const [view, setView] = createSignal<Date>(
		(() => {
			const d = parseISODate(value().start) ?? new Date();
			return new Date(d.getFullYear(), d.getMonth(), 1);
		})(),
	);
	const [hoverIso, setHoverIso] = createSignal<string | null>(null);

	const presetList = () => (local.presets === true ? defaultRangePresets : (local.presets ?? []));

	/** First pick sets start, second pick (>= start) sets end and closes. */
	const pick = (iso: string) => {
		const v = value();
		if (!v.start || (v.start && v.end) || iso < v.start) {
			setValue({ start: iso, end: "" });
		} else {
			setValue({ start: v.start, end: iso });
			setOpen(false);
		}
	};

	/** While picking the end, preview the hovered day as the range end. */
	const previewEnd = () => {
		const v = value();
		if (v.start && !v.end && hoverIso() && (hoverIso() as string) > v.start) return hoverIso() as string;
		return v.end;
	};

	const applyPreset = (p: DateRangePreset) => {
		const r = typeof p.value === "function" ? p.value() : p.value;
		setValue({
			start: clampRangeStart(r.start, "", local.minDate, local.maxDate),
			end: clampRangeEnd(r.end, "", local.minDate, local.maxDate),
		});
		setOpen(false);
	};

	const clear = () => setValue({ start: "", end: "" });

	useClickOutside(
		() => root,
		() => setOpen(false),
		{ enabled: open },
	);
	useEscapeKey(() => setOpen(false), { when: open });

	const className = () =>
		[
			"flex items-center gap-2 border transition-colors motion-reduce:transition-none focus-within:ring-1 focus-within:ring-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.error ? "border-destructive" : "",
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const inputClass =
		"min-w-0 flex-1 rounded-md border-0 bg-transparent px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed";
	const errorId = `${uid}-error`;
	const hasValue = () => Boolean(value().start || value().end);

	return (
		<div ref={root} class={`solidui-date-range-picker relative ${local.fullWidth ? "w-full" : "inline-block"}`}>
			<Show when={local.label}>
				<span id={`${uid}-label`} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</span>
			</Show>
			<div class={className()} {...rest}>
				<input
					type="date"
					class={inputClass}
					value={value().start}
					min={local.minDate}
					max={rangeStartMax(value().end, local.maxDate)}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					aria-label={local.startLabel ?? "Start date"}
					aria-invalid={local.error ? true : undefined}
					aria-describedby={typeof local.error === "string" ? errorId : undefined}
					onChange={(e) =>
						setValue({
							...value(),
							start: e.currentTarget.value
								? clampRangeStart(e.currentTarget.value, value().end, local.minDate, local.maxDate)
								: "",
						})
					}
				/>
				<span class="text-muted-foreground" aria-hidden="true">
					→
				</span>
				<input
					type="date"
					class={inputClass}
					value={value().end}
					min={rangeEndMin(value().start, local.minDate)}
					max={local.maxDate}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					aria-label={local.endLabel ?? "End date"}
					aria-invalid={local.error ? true : undefined}
					aria-describedby={typeof local.error === "string" ? errorId : undefined}
					onChange={(e) =>
						setValue({
							...value(),
							end: e.currentTarget.value
								? clampRangeEnd(e.currentTarget.value, value().start, local.minDate, local.maxDate)
								: "",
						})
					}
				/>
				<Show when={local.clearable && hasValue() && !local.disabled && !local.readOnly}>
					<button type="button" class={pickerIconBtn} aria-label="Clear range" tabIndex={-1} onClick={clear}>
						<ClearIcon />
					</button>
				</Show>
				<button
					type="button"
					class={pickerIconBtn}
					aria-label={open() ? "Close calendar" : "Open calendar"}
					aria-haspopup="dialog"
					aria-expanded={open()}
					disabled={local.disabled || local.readOnly}
					onClick={() => setOpen(!open())}
				>
					<CalendarIcon />
				</button>
			</div>
			<Show when={local.name}>
				<input type="hidden" name={local.name} value={`${value().start},${value().end}`} />
			</Show>
			<DateRangeDropdown
				open={open()}
				presets={presetList()}
				onPreset={applyPreset}
				month={view()}
				onMonthChange={setView}
				rangeStart={value().start || undefined}
				rangeEnd={previewEnd() || undefined}
				minDate={local.minDate}
				maxDate={local.maxDate}
				weekStartsOn={local.weekStartsOn}
				highlightToday={local.highlightToday}
				dimWeekends={local.dimWeekends}
				size={local.size}
				radius={local.radius}
				onSelect={pick}
				onDayHover={setHoverIso}
				onEscape={() => setOpen(false)}
			/>
			<Show when={typeof local.error === "string" && local.error}>
				<p id={errorId} role="alert" class="mt-1 text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
