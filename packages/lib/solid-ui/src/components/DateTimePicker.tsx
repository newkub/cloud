/**
 * DateTimePicker — combined date + time inputs emitting an ISO-like value,
 * with an optional calendar dropdown for the date part.
 * The dropdown panel lives in `./date-time-picker/DateTimePickerDropdown`.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius } from "../lib/variants";
import { parseISODate } from "./DatePicker";
import { DateTimePickerDropdown } from "./date-time-picker/dropdown";

export interface DateTimePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled "YYYY-MM-DDTHH:mm" value ("HH:mm:ss" when `withSeconds`). */
	value?: string;
	/** Initial value (uncontrolled). */
	defaultValue?: string;
	/** Visual style of both inputs. @default "default" */
	variant?: InputVariant;
	/** Control size. @default "md" */
	size?: ControlSize;
	/** Called with the combined value — empty string when cleared. */
	onChange?: (value: string) => void;
	/** Earliest allowed date/datetime — clamps and disables grid days. */
	minDate?: string;
	/** Latest allowed date/datetime. */
	maxDate?: string;
	/** Show a seconds field in the time input. @default false */
	withSeconds?: boolean;
	/** Minute granularity — sets the native `step` (minutes × 60s). */
	minuteStep?: number;
	/** Show a × button that clears the value. */
	clearable?: boolean;
	/** Controlled dropdown open state for the calendar. */
	open?: boolean;
	/** Initial open state (uncontrolled). @default false */
	defaultOpen?: boolean;
	/** Called when the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** First day of the week in the dropdown grid: 0 = Sunday, 1 = Monday. @default 0 */
	weekStartsOn?: 0 | 1;
	/** Read-only — typing and the dropdown are blocked. */
	readOnly?: boolean;
	/** Mark both inputs required. */
	required?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above. */
	label?: string;
	/** Form field name — renders a hidden input with the combined value. */
	name?: string;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const sizeClass = { sm: "h-8 text-xs", md: "h-9 text-sm", lg: "h-10 text-sm" } as const;

export function DateTimePicker(props: DateTimePickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"variant",
		"size",
		"onChange",
		"minDate",
		"maxDate",
		"withSeconds",
		"minuteStep",
		"clearable",
		"open",
		"defaultOpen",
		"onOpenChange",
		"weekStartsOn",
		"readOnly",
		"required",
		"error",
		"label",
		"name",
		"disabled",
		"radius",
		"fullWidth",
	]);
	let root: HTMLDivElement | undefined;

	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [openInternal, setOpenInternal] = createSignal(local.defaultOpen ?? false);
	const [view, setView] = createSignal<Date>(
		(() => {
			const d = parseISODate(local.defaultValue ?? local.value ?? "") ?? new Date();
			return new Date(d.getFullYear(), d.getMonth(), 1);
		})(),
	);

	const value = () => local.value ?? internal();
	const open = () => (local.open !== undefined ? local.open : openInternal());
	const setOpen = (next: boolean) => {
		if (local.disabled || local.readOnly) return;
		setOpenInternal(next);
		local.onOpenChange?.(next);
	};

	const date = () => value().split("T")[0] ?? "";
	const time = () => value().split("T")[1] ?? "";

	/** Clamp the combined value to [minDate, maxDate] (ISO strings compare lexically). */
	const clamp = (v: string) => {
		if (local.minDate && v && v < local.minDate) return local.minDate;
		if (local.maxDate && v && v > local.maxDate) return local.maxDate;
		return v;
	};

	const update = (d: string, t: string) => {
		const next = clamp(d && t ? `${d}T${t}` : d || t);
		setInternal(next);
		local.onChange?.(next);
	};

	const pickDay = (iso: string) => {
		update(iso, time() || "00:00");
		setOpen(false);
	};

	const step = () => (local.withSeconds ? 1 : (local.minuteStep ?? 1) * 60);

	useClickOutside(
		() => root,
		() => setOpen(false),
		{ enabled: open },
	);
	useEscapeKey(() => setOpen(false), { when: open });

	const cls = () =>
		`flex-1 rounded-md border px-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${sizeClass[local.size ?? "md"]} ${inputVariants[local.variant ?? "default"]} ${local.error ? "border-destructive" : ""}`;
	const iconBtn =
		"flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

	return (
		<div
			ref={root}
			class={`solidui-datetime-picker relative ${local.fullWidth ? "w-full" : "inline-flex"} flex-col gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<span class="text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			<div class="flex items-center gap-2">
				<input
					type="date"
					value={date()}
					min={local.minDate?.slice(0, 10)}
					max={local.maxDate?.slice(0, 10)}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					class={cls()}
					aria-invalid={local.error ? true : undefined}
					onInput={(e) => update(e.currentTarget.value, time() || "00:00")}
					aria-label="Date"
				/>
				<input
					type="time"
					value={time()}
					step={step()}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					class={cls()}
					aria-invalid={local.error ? true : undefined}
					onInput={(e) => update(date() || new Date().toISOString().slice(0, 10), e.currentTarget.value)}
					aria-label="Time"
				/>
				<Show when={local.clearable && value() && !local.disabled && !local.readOnly}>
					<button
						type="button"
						class={iconBtn}
						aria-label="Clear date and time"
						onClick={() => {
							setInternal("");
							local.onChange?.("");
						}}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</Show>
				<button
					type="button"
					class={iconBtn}
					aria-label={open() ? "Close calendar" : "Open calendar"}
					aria-haspopup="dialog"
					aria-expanded={open()}
					disabled={local.disabled || local.readOnly}
					onClick={() => {
						const d = parseISODate(date());
						if (d) setView(new Date(d.getFullYear(), d.getMonth(), 1));
						setOpen(!open());
					}}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</div>
			<Show when={local.name}>
				<input type="hidden" name={local.name} value={value()} />
			</Show>
			<Show when={open()}>
				<DateTimePickerDropdown
					month={view()}
					onMonthChange={setView}
					selected={date() || undefined}
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
