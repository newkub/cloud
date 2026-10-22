/**
 * DatePicker — text input with a dropdown calendar grid.
 *
 * Emits ISO "YYYY-MM-DD" strings. The shared date helpers live in
 * `./date-helpers` and the `CalendarGrid` primitive in `./CalendarGrid` —
 * both are re-exported here so `from "./DatePicker"` keeps working for
 * DateRangePicker, WeekPicker and DateTimePicker.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, createUniqueId, Show, splitProps } from "solid-js";
import { inputVariants, radiusMap } from "../lib/variants";
import { clampISODate, firstOfMonth, formatISODate, parseByFormat, parseISODate, toISODate } from "./date-helpers";
import { DatePickerDropdown } from "./date-picker/DatePickerDropdown";
import { createDatePickerInputHandlers } from "./date-picker/handlers";
import { CalendarIcon, ClearIcon, pickerIconBtn, pickerSizeMap } from "./date-picker/shared";
import type { DatePickerPreset, DatePickerProps } from "./date-picker/types";

export { CalendarGrid, type CalendarGridProps } from "./CalendarGrid";
export {
	addDaysISO,
	addMonthsISO,
	clampISODate,
	formatISODate,
	parseByFormat,
	parseISODate,
	todayISO,
	toISODate,
} from "./date-helpers";
export type { DatePickerPreset, DatePickerProps } from "./date-picker/types";

export function DatePicker(props: DatePickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"minDate",
		"maxDate",
		"valueFormat",
		"open",
		"defaultOpen",
		"onOpenChange",
		"clearable",
		"presets",
		"highlightToday",
		"dimWeekends",
		"weekStartsOn",
		"fullWidth",
		"error",
		"label",
		"radius",
		"disabled",
		"readOnly",
		"required",
		"name",
		"id",
		"placeholder",
		"aria-label",
		"onInput",
		"onFocus",
		"onBlur",
		"onKeyDown",
		"onClick",
	]);

	const uid = createUniqueId();
	const inputId = () => local.id ?? `solidui-datepicker-${uid}`;
	let root: HTMLDivElement | undefined;
	let inputRef: HTMLInputElement | undefined;

	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		local.onChange?.(next);
	};

	const [openInternal, setOpenInternal] = createSignal(local.defaultOpen ?? false);
	const open = () => (local.open !== undefined ? local.open : openInternal());
	const setOpen = (next: boolean) => {
		if (local.disabled) return;
		setOpenInternal(next);
		local.onOpenChange?.(next);
	};

	const format = () => local.valueFormat ?? "YYYY-MM-DD";
	const display = () => (value() ? formatISODate(value(), format()) : "");
	/** Non-null while the user is typing — shows the raw text instead of the formatted value. */
	const [draft, setDraft] = createSignal<string | null>(null);
	const shown = () => draft() ?? display();

	const [view, setView] = createSignal<Date>(firstOfMonth(parseISODate(value()) ?? new Date()));

	const commitDraft = () => {
		const d = draft();
		if (d === null) return;
		setDraft(null);
		const trimmed = d.trim();
		if (trimmed === "") {
			setValue("");
			return;
		}
		const parsedDate = parseISODate(trimmed);
		const parsed = parsedDate ? toISODate(parsedDate) : parseByFormat(trimmed, format());
		if (parsed) setValue(clampISODate(parsed, local.minDate, local.maxDate));
	};

	const pick = (iso: string) => {
		setValue(iso);
		setOpen(false);
		inputRef?.focus();
	};

	const applyPreset = (p: DatePickerPreset) => {
		const iso = typeof p.value === "function" ? p.value() : p.value;
		const clamped = clampISODate(iso, local.minDate, local.maxDate);
		setValue(clamped);
		setOpen(false);
		inputRef?.focus();
	};

	useClickOutside(
		() => root,
		() => setOpen(false),
		{ enabled: open },
	);
	useEscapeKey(
		() => {
			setOpen(false);
			inputRef?.focus();
		},
		{ when: open },
	);

	const base =
		"flex w-full items-center gap-1 border transition-colors motion-reduce:transition-none focus-within:ring-1 focus-within:ring-ring aria-invalid:border-destructive aria-invalid:focus-within:ring-destructive has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";
	const className = () =>
		[
			base,
			inputVariants[local.variant ?? "default"],
			pickerSizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.error ? "border-destructive" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const errorId = () => `${inputId()}-error`;

	const {
		onInput,
		onFocus,
		onBlur,
		onKeyDown,
		onClick: onClickInput,
	} = createDatePickerInputHandlers(local, {
		display,
		setDraft,
		commitDraft,
		open,
		setOpen,
	});

	return (
		<div ref={root} class={`solidui-date-picker relative ${local.fullWidth ? "w-full" : "inline-block"}`}>
			<Show when={local.label}>
				<label for={inputId()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div class={className()} aria-invalid={local.error ? true : undefined}>
				<input
					{...rest}
					ref={inputRef}
					id={inputId()}
					type="text"
					role="combobox"
					aria-haspopup="dialog"
					aria-expanded={open()}
					aria-invalid={local.error ? true : undefined}
					aria-describedby={typeof local.error === "string" ? errorId() : undefined}
					aria-label={local["aria-label"] ?? local.label ?? "Date"}
					class="min-w-0 flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed"
					value={shown()}
					placeholder={local.placeholder ?? format()}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					onInput={onInput}
					onFocus={onFocus}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					onClick={onClickInput}
				/>
				<Show when={local.clearable && value() && !local.disabled && !local.readOnly}>
					<button
						type="button"
						class={pickerIconBtn}
						aria-label="Clear date"
						tabIndex={-1}
						onClick={() => {
							setValue("");
							inputRef?.focus();
						}}
					>
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
				<input type="hidden" name={local.name} value={value()} />
			</Show>
			<DatePickerDropdown
				open={open()}
				presets={local.presets}
				onPreset={applyPreset}
				month={view()}
				onMonthChange={setView}
				selected={value() || undefined}
				minDate={local.minDate}
				maxDate={local.maxDate}
				weekStartsOn={local.weekStartsOn}
				highlightToday={local.highlightToday}
				dimWeekends={local.dimWeekends}
				size={local.size}
				radius={local.radius}
				onSelect={pick}
				onEscape={() => {
					setOpen(false);
					inputRef?.focus();
				}}
			/>
			<Show when={typeof local.error === "string" && local.error}>
				<p id={errorId()} role="alert" class="mt-1 text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
