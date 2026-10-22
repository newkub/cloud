/**
 * DurationPicker — days/hours/minutes/seconds inputs that emit total milliseconds,
 * with optional quick-pick presets and min/max clamping.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export type DurationUnit = "days" | "hours" | "minutes" | "seconds";

const UNIT_MS: Record<DurationUnit, number> = {
	days: 86_400_000,
	hours: 3_600_000,
	minutes: 60_000,
	seconds: 1_000,
};

/** Quick-pick duration rendered as a chip below the inputs. */
export interface DurationPreset {
	label: string;
	/** Duration in milliseconds. */
	ms: number;
}

export interface DurationPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Total duration in milliseconds (controlled). */
	value?: number;
	/** Initial duration in ms (uncontrolled). @default 0 */
	defaultValue?: number;
	/** Called with the total milliseconds — clamped to [min, max]. */
	onChange?: (ms: number) => void;
	/** Which units to render. @default ["hours","minutes","seconds"] */
	units?: DurationUnit[];
	/** Quick-pick buttons rendered below the inputs. */
	presets?: DurationPreset[];
	/** Minimum total ms — values are clamped up. */
	min?: number;
	/** Maximum total ms — values are clamped down. */
	max?: number;
	/** Show a × button resetting to `min ?? 0` and calling {@link onClear}. */
	clearable?: boolean;
	/** Called after a clear. */
	onClear?: () => void;
	/** Summary text, e.g. "1d 2h 30m". @default true */
	showSummary?: boolean;
	/** Read-only — inputs render but cannot be edited. */
	readOnly?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above. */
	label?: string;
	/** Form field name — renders a hidden input with the ms value. */
	name?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	disabled?: boolean;
}

const inputCls = {
	sm: "h-7 w-12 text-2xs",
	md: "h-8 w-14 text-xs",
	lg: "h-9 w-16 text-sm",
} as const;

const UNIT_LABEL: Record<DurationUnit, string> = { days: "d", hours: "h", minutes: "m", seconds: "s" };
const UNIT_ARIA: Record<DurationUnit, string> = {
	days: "Days",
	hours: "Hours",
	minutes: "Minutes",
	seconds: "Seconds",
};

export function DurationPicker(props: DurationPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"units",
		"presets",
		"min",
		"max",
		"clearable",
		"onClear",
		"showSummary",
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
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);

	const clampMs = (ms: number) => Math.min(local.max ?? Number.MAX_SAFE_INTEGER, Math.max(local.min ?? 0, ms));
	const value = () => clampMs(local.value ?? internal());
	const setValue = (ms: number) => {
		const next = clampMs(ms);
		setInternal(next);
		local.onChange?.(next);
	};

	const units = () => local.units ?? (["hours", "minutes", "seconds"] as DurationUnit[]);
	const part = (unit: DurationUnit) => {
		const ms = value();
		return (
			Math.floor(ms / UNIT_MS[unit]) %
			(unit === "days" ? Number.MAX_SAFE_INTEGER : { hours: 24, minutes: 60, seconds: 60 }[unit])
		);
	};
	const setPart = (unit: DurationUnit, raw: string) => {
		const next = Math.max(0, Math.floor(Number(raw) || 0));
		let total = 0;
		for (const u of units()) total += (u === unit ? next : part(u)) * UNIT_MS[u];
		setValue(total);
	};
	const summary = () => {
		const ms = value();
		if (ms === 0) return "0s";
		const out: string[] = [];
		let rest = ms;
		for (const u of ["days", "hours", "minutes", "seconds"] as DurationUnit[]) {
			const n = Math.floor(rest / UNIT_MS[u]);
			if (n) {
				out.push(`${n}${UNIT_LABEL[u]}`);
				rest -= n * UNIT_MS[u];
			}
		}
		return out.join(" ");
	};

	return (
		<div
			class={`solidui-duration-picker ${local.fullWidth ? "w-full" : "inline-flex"} flex-col gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<span class="text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			<div class="inline-flex flex-wrap items-center gap-1" aria-invalid={local.error ? true : undefined}>
				<For each={units()}>
					{(unit, i) => (
						<>
							<Show when={i() > 0}>
								<span class="text-muted-foreground">:</span>
							</Show>
							<span class="inline-flex items-center gap-1">
								<input
									type="number"
									min={0}
									max={unit === "days" ? undefined : { hours: 23, minutes: 59, seconds: 59 }[unit]}
									value={part(unit)}
									disabled={local.disabled}
									readOnly={local.readOnly}
									aria-label={UNIT_ARIA[unit]}
									class={`border bg-surface text-center font-mono tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${inputVariants[local.variant ?? "default"]} ${inputCls[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""}`}
									onInput={(e) => setPart(unit, e.currentTarget.value)}
								/>
								<span class={`text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
									{UNIT_LABEL[unit]}
								</span>
							</span>
						</>
					)}
				</For>
				<Show when={local.clearable && value() !== (local.min ?? 0) && !local.disabled && !local.readOnly}>
					<button
						type="button"
						aria-label="Clear duration"
						class="ml-1 flex h-6 w-6 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => {
							setValue(local.min ?? 0);
							local.onClear?.();
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
				<Show when={local.showSummary ?? true}>
					<span class="ml-2 font-mono text-2xs text-muted-foreground">{summary()}</span>
				</Show>
			</div>
			<Show when={local.presets?.length}>
				<div class="flex flex-wrap gap-1">
					<For each={local.presets}>
						{(p) => (
							<button
								type="button"
								disabled={local.disabled || local.readOnly}
								class={`border border-border bg-surface px-2 text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${local.size === "sm" ? "h-6 text-2xs" : "h-7 text-xs"} ${radiusMap[local.radius ?? "md"]}`}
								onClick={() => setValue(p.ms)}
							>
								{p.label}
							</button>
						)}
					</For>
				</div>
			</Show>
			<Show when={local.name}>
				<input type="hidden" name={local.name} value={value()} />
			</Show>
			<Show when={typeof local.error === "string" && local.error}>
				<p role="alert" class="text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
