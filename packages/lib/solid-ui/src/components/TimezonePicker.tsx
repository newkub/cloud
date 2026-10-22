/**
 * TimezonePicker — searchable IANA timezone select grouped by region
 * with live clock preview and an optional "current timezone" shortcut.
 */

import { useDebounced } from "@wrikka/hooks";
import { createMemo, createSignal, createUniqueId, For, type JSX, onCleanup, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface TimezonePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled IANA timezone name. */
	value?: string;
	/** Initial timezone (uncontrolled). */
	defaultValue?: string;
	/** Called with the selected IANA name — empty string when cleared. */
	onChange?: (timezone: string) => void;
	/** Restrict to these IANA names — defaults to all supported. */
	timezones?: string[];
	/** Live clock of the selected zone. @default true */
	showClock?: boolean;
	/** Filter input above the select. @default true */
	searchable?: boolean;
	/** Debounce (ms) applied to the filter input. @default 150 */
	searchDebounce?: number;
	/** Placeholder of the filter input. @default "Filter timezones…" */
	searchPlaceholder?: string;
	/** Group options into region optgroups (America/*, Europe/*, …). @default true */
	groupByRegion?: boolean;
	/** Add a "Current timezone" option resolving to the detected local zone. @default false */
	showLocalOption?: boolean;
	/** Allow picking the empty option — emits "". @default false */
	clearable?: boolean;
	/** Read-only — the select is visible but selection is reverted. */
	readOnly?: boolean;
	/** Mark the select required. */
	required?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above the control. */
	label?: string;
	/** Form field name applied to the select. */
	name?: string;
	/** Text shown when the filter matches nothing. @default "No timezones found" */
	emptyMessage?: string;
	placeholder?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	disabled?: boolean;
}

const ctrl = { sm: "h-7 text-2xs", md: "h-8 text-xs", lg: "h-9 text-sm" } as const;

function allZones(): string[] {
	try {
		return Intl.supportedValuesOf("timeZone");
	} catch {
		return ["UTC", "Asia/Bangkok", "Europe/London", "America/New_York"];
	}
}

/** Detected local IANA timezone, or "UTC" when unavailable. */
export function localTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
	} catch {
		return "UTC";
	}
}

/** Current UTC offset label, e.g. "UTC+07:00". */
export function utcOffset(tz: string, at = new Date()): string {
	try {
		const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" }).formatToParts(at);
		return parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
	} catch {
		return "UTC";
	}
}

export function TimezonePicker(props: TimezonePickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"timezones",
		"showClock",
		"searchable",
		"searchDebounce",
		"searchPlaceholder",
		"groupByRegion",
		"showLocalOption",
		"clearable",
		"readOnly",
		"required",
		"error",
		"label",
		"name",
		"emptyMessage",
		"placeholder",
		"variant",
		"size",
		"radius",
		"disabled",
		"fullWidth",
		"id",
	]);
	const uid = createUniqueId();
	const selectId = () => local.id ?? `solidui-timezone-picker-${uid}`;

	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const value = () => (local.value !== undefined ? local.value : internal());
	const setValue = (tz: string) => {
		setInternal(tz);
		local.onChange?.(tz);
	};

	const [q, setQ] = createSignal("");
	const debouncedQ = useDebounced(q, local.searchDebounce ?? 150);
	const [now, setNow] = createSignal(new Date());
	const timer = setInterval(() => setNow(new Date()), 30_000);
	onCleanup(() => clearInterval(timer));

	const zones = () => local.timezones ?? allZones();
	const filtered = () => {
		const needle = debouncedQ().toLowerCase();
		return needle ? zones().filter((z) => z.toLowerCase().includes(needle)) : zones();
	};

	/** Zones grouped by the region prefix before the first "/". */
	const groups = createMemo((): [string, string[]][] => {
		const map = new Map<string, string[]>();
		for (const z of filtered()) {
			const region = z.includes("/") ? z.split("/")[0] : "Other";
			const list = map.get(region);
			if (list) list.push(z);
			else map.set(region, [z]);
		}
		return [...map.entries()];
	});

	const clock = () => {
		const tz = value();
		if (!tz) return "";
		try {
			return now().toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
		} catch {
			return "";
		}
	};

	const optionLabel = (tz: string) => `${tz} (${utcOffset(tz)})`;
	const localTz = localTimezone();

	const onSelect = (e: Event & { currentTarget: HTMLSelectElement }) => {
		if (local.readOnly) {
			e.currentTarget.value = value();
			return;
		}
		setValue(e.currentTarget.value);
	};

	const inputClass = () =>
		`w-full border bg-surface px-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${inputVariants[local.variant ?? "default"]} ${ctrl[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""}`;

	return (
		<div
			class={`solidui-timezone-picker ${local.fullWidth ? "w-full" : "inline-flex"} max-w-full flex-col gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<label for={selectId()} class="block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<Show when={local.searchable ?? true}>
				<input
					type="text"
					value={q()}
					placeholder={local.searchPlaceholder ?? "Filter timezones…"}
					disabled={local.disabled}
					aria-label="Filter timezones"
					class={inputClass()}
					onInput={(e) => setQ(e.currentTarget.value)}
				/>
			</Show>
			<select
				id={selectId()}
				name={local.name}
				value={value()}
				disabled={local.disabled}
				required={local.required}
				aria-readonly={local.readOnly || undefined}
				aria-invalid={local.error ? true : undefined}
				aria-label={local.label ?? "Timezone"}
				class={`${inputClass()} max-w-full`}
				onChange={onSelect}
			>
				<option value="" disabled={!local.clearable}>
					{local.placeholder ?? "Select timezone"}
				</option>
				<Show when={local.showLocalOption}>
					<option value={localTz}>Current timezone — {optionLabel(localTz)}</option>
				</Show>
				<Show when={(local.groupByRegion ?? true) && filtered().length > 0}>
					<For each={groups()}>
						{([region, list]) => (
							<optgroup label={region}>
								<For each={list}>{(tz) => <option value={tz}>{optionLabel(tz)}</option>}</For>
							</optgroup>
						)}
					</For>
				</Show>
				<Show when={!(local.groupByRegion ?? true)}>
					<For each={filtered()}>{(tz) => <option value={tz}>{optionLabel(tz)}</option>}</For>
				</Show>
			</select>
			<Show when={filtered().length === 0}>
				<span class="text-2xs text-muted-foreground">{local.emptyMessage ?? "No timezones found"}</span>
			</Show>
			<Show when={(local.showClock ?? true) && value()}>
				<span class="font-mono text-2xs tabular-nums text-muted-foreground">
					{clock()} · {utcOffset(value() || "UTC")}
				</span>
			</Show>
			<Show when={typeof local.error === "string" && local.error}>
				<p role="alert" class="text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
