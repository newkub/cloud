/**
 * MonthPicker — month/year grid picker. Inline by default; pass `dropdown`
 * to render a text-input trigger with the grid in a popover. The grid lives
 * in `./month-picker/MonthGrid` and shares helpers with `./date-helpers` and
 * `./date-picker/shared`.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, createUniqueId, Show, splitProps } from "solid-js";
import { inputVariants, radiusMap } from "../lib/variants";
import { formatISODate } from "./date-helpers";
import { CalendarIcon, ClearIcon, pickerIconBtn, pickerSizeMap } from "./date-picker/shared";
import { MonthGrid } from "./month-picker/MonthGrid";
import type { MonthPickerProps } from "./month-picker/types";

export type { MonthPickerProps } from "./month-picker/types";

const toMonth = (v: string) => v.slice(0, 7);

export function MonthPicker(props: MonthPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"size",
		"onChange",
		"minDate",
		"maxDate",
		"dropdown",
		"open",
		"defaultOpen",
		"onOpenChange",
		"clearable",
		"valueFormat",
		"placeholder",
		"variant",
		"error",
		"label",
		"name",
		"readOnly",
		"required",
		"disabled",
		"radius",
		"fullWidth",
	]);
	const uid = createUniqueId();
	let root: HTMLDivElement | undefined;

	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [year, setYear] = createSignal(Number((local.defaultValue ?? "").split("-")[0]) || new Date().getFullYear());
	const [cursor, setCursor] = createSignal(
		Number((local.defaultValue ?? "").split("-")[1] || new Date().getMonth() + 1) - 1,
	);
	const value = () => local.value ?? internal();
	const setValue = (next: string) => {
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

	const minMonth = () => (local.minDate ? toMonth(local.minDate) : undefined);
	const maxMonth = () => (local.maxDate ? toMonth(local.maxDate) : undefined);
	const monthDisabled = (m: number) => {
		const v = `${year()}-${String(m + 1).padStart(2, "0")}`;
		return (
			local.disabled ||
			(minMonth() !== undefined && v < (minMonth() as string)) ||
			(maxMonth() !== undefined && v > (maxMonth() as string))
		);
	};

	const select = (m: number) => {
		if (monthDisabled(m)) return;
		const next = `${year()}-${String(m + 1).padStart(2, "0")}`;
		setValue(next);
		if (local.dropdown) setOpen(false);
	};

	const prevYearDisabled = () =>
		local.disabled || (minMonth() !== undefined && year() - 1 < Number((minMonth() as string).slice(0, 4)));
	const nextYearDisabled = () =>
		local.disabled || (maxMonth() !== undefined && year() + 1 > Number((maxMonth() as string).slice(0, 4)));

	useClickOutside(
		() => root,
		() => setOpen(false),
		{ enabled: open },
	);
	useEscapeKey(() => setOpen(false), { when: open });

	const format = () => local.valueFormat ?? "MMM YYYY";
	const display = () => {
		const v = value();
		return v ? formatISODate(`${v}-01`, format()) : "";
	};

	const grid = () => (
		<MonthGrid
			year={year}
			setYear={setYear}
			cursor={cursor}
			setCursor={setCursor}
			value={value}
			monthDisabled={monthDisabled}
			prevYearDisabled={prevYearDisabled}
			nextYearDisabled={nextYearDisabled}
			onSelect={select}
			onEscape={() => {
				if (local.dropdown) setOpen(false);
			}}
			size={local.size}
			radius={local.radius}
			fullWidth={local.fullWidth}
		/>
	);

	const frame = () =>
		`solidui-month-picker inline-block rounded-lg border p-3 ${inputVariants[local.variant ?? "default"]} ${
			local.error ? "border-destructive" : ""
		} ${local.class ?? ""}`.trim();

	if (!local.dropdown) {
		return (
			<div class={frame()} aria-invalid={local.error ? true : undefined} {...rest}>
				{grid()}
				<Show when={typeof local.error === "string" && local.error}>
					<p role="alert" class="mt-1 text-xs text-destructive">
						{local.error}
					</p>
				</Show>
			</div>
		);
	}

	return (
		<div ref={root} class={`solidui-month-picker relative ${local.fullWidth ? "w-full" : "inline-block"}`}>
			<Show when={local.label}>
				<label for={`${uid}-input`} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div
				class={`flex items-center gap-1 border transition-colors motion-reduce:transition-none focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${pickerSizeMap[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""} ${local.class ?? ""}`}
				aria-invalid={local.error ? true : undefined}
				{...rest}
			>
				<input
					id={`${uid}-input`}
					type="text"
					role="combobox"
					aria-haspopup="dialog"
					aria-expanded={open()}
					aria-label={local.label ?? "Month"}
					class="min-w-0 flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed"
					value={display()}
					placeholder={local.placeholder ?? format()}
					disabled={local.disabled}
					readOnly
					required={local.required}
					onClick={() => setOpen(!open())}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown" && !open()) setOpen(true);
						else if (e.key === "Escape" && open()) {
							e.stopPropagation();
							setOpen(false);
						}
					}}
				/>
				<Show when={local.clearable && value() && !local.disabled && !local.readOnly}>
					<button
						type="button"
						class={pickerIconBtn}
						aria-label="Clear month"
						tabIndex={-1}
						onClick={() => setValue("")}
					>
						<ClearIcon />
					</button>
				</Show>
				<button
					type="button"
					class={pickerIconBtn}
					aria-label={open() ? "Close months" : "Open months"}
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
			<Show when={open()}>
				<div
					role="dialog"
					aria-label="Choose month"
					class={`absolute left-0 top-full z-dropdown mt-1 w-64 border border-border bg-surface p-3 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
				>
					{grid()}
				</div>
			</Show>
			<Show when={typeof local.error === "string" && local.error}>
				<p role="alert" class="mt-1 text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
