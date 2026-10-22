/**
 * CronInput — cron expression editor with preset picks and a human-readable preview.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface CronPreset {
	label: string;
	expression: string;
}

export const CRON_PRESETS: CronPreset[] = [
	{ label: "Every minute", expression: "* * * * *" },
	{ label: "Hourly", expression: "0 * * * *" },
	{ label: "Daily at midnight", expression: "0 0 * * *" },
	{ label: "Weekdays 9am", expression: "0 9 * * 1-5" },
	{ label: "Weekly (Mon)", expression: "0 0 * * 1" },
	{ label: "Monthly", expression: "0 0 1 * *" },
];

const FIELD_NAMES = ["minute", "hour", "day", "month", "weekday"] as const;
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/** Validate a 5-field cron expression; returns per-field ok flags. */
export function parseCron(expr: string): { fields: string[]; valid: boolean[] } {
	const fields = expr.trim().split(/\s+/);
	const ok = (s: string) => /^[\d*,/-]+$/.test(s) && s.length > 0;
	return {
		fields,
		valid: FIELD_NAMES.map((_, i) => ok(fields[i] ?? "")),
	};
}

const pad2 = (s: string) => s.padStart(2, "0");
const clock = (h: string, m: string) => `${pad2(h)}:${pad2(m)}`;

/**
 * Humanize a 5-field cron expression — matches presets first, then common
 * patterns. Returns null when the shape is not recognized.
 */
export function describeCron(expr: string, presets: CronPreset[] = CRON_PRESETS): string | null {
	const normalized = expr.trim().replace(/\s+/g, " ");
	const preset = presets.find((p) => p.expression === normalized);
	if (preset) return preset.label;
	const { fields, valid } = parseCron(normalized);
	if (fields.length !== 5 || !valid.every(Boolean)) return null;
	const [m, h, dom, mon, dow] = fields;
	if (m === "*" && h === "*" && dom === "*" && mon === "*" && dow === "*") return "Every minute";
	if (/^\*\/\d+$/.test(m) && h === "*" && dom === "*" && mon === "*" && dow === "*")
		return `Every ${m.slice(2)} minutes`;
	if (/^\d+$/.test(m) && h === "*" && dom === "*" && mon === "*" && dow === "*") return `Hourly at minute ${m}`;
	if (/^\d+$/.test(m) && /^\*\/\d+$/.test(h) && dom === "*" && mon === "*" && dow === "*")
		return `Every ${h.slice(2)} hours at minute ${m}`;
	if (!/^\d+$/.test(m) || !/^\d+$/.test(h)) return null;
	const time = clock(h, m);
	if (dom === "*" && mon === "*" && dow === "*") return `Daily at ${time}`;
	if (dom === "*" && mon === "*" && dow === "1-5") return `Weekdays at ${time}`;
	if (dom === "*" && mon === "*" && (dow === "0,6" || dow === "6,0" || dow === "0,7")) return `Weekends at ${time}`;
	if (dom === "*" && mon === "*" && /^\d$/.test(dow)) return `Weekly on ${DAY_NAMES[Number(dow) % 7]} at ${time}`;
	if (/^\d+$/.test(dom) && mon === "*" && dow === "*") return `Monthly on day ${dom} at ${time}`;
	if (/^\d+$/.test(dom) && /^\d+$/.test(mon) && dow === "*")
		return `Yearly on ${MONTH_NAMES[(Number(mon) - 1) % 12]} ${dom} at ${time}`;
	return null;
}

export interface CronInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput"> {
	value?: string;
	onChange?: (expression: string) => void;
	/** Quick-pick presets. @default CRON_PRESETS — pass [] to hide. */
	presets?: CronPreset[];
	/** Show per-field labels under the inputs. @default true */
	showFieldLabels?: boolean;
	/** Show validity hint. @default true */
	showHint?: boolean;
	/** Show a human-readable description of a valid expression. @default true */
	showDescription?: boolean;
	/** External error — boolean styles the fields, a string replaces the hint text. */
	error?: boolean | string;
	/** Prevent editing while keeping the expression visible. @default false */
	readOnly?: boolean;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const fieldCls = {
	sm: "h-7 w-10 text-2xs",
	md: "h-8 w-12 text-xs",
	lg: "h-9 w-14 text-sm",
} as const;

export function CronInput(props: CronInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"presets",
		"showFieldLabels",
		"showHint",
		"showDescription",
		"error",
		"readOnly",
		"variant",
		"size",
		"radius",
		"disabled",
	]);
	const parsed = () => parseCron(local.value ?? "");
	const presets = () => local.presets ?? CRON_PRESETS;
	const allValid = () => parsed().valid.every(Boolean) && parsed().fields.length === 5;
	const invalid = () => Boolean(local.error) || !parsed().valid.every(Boolean);
	const description = () => (allValid() ? describeCron(local.value ?? "", presets()) : null);
	const setField = (i: number, v: string) => {
		const fields = [...parsed().fields];
		while (fields.length < 5) fields.push("*");
		fields[i] = v || "*";
		local.onChange?.(fields.join(" "));
	};

	return (
		<div class={`solidui-cron-input ${local.class ?? ""}`.trim()} {...rest}>
			<div class="flex flex-wrap items-end gap-1">
				<For each={FIELD_NAMES}>
					{(name, i) => (
						<label class="flex flex-col items-center gap-0.5">
							<input
								type="text"
								value={parsed().fields[i()] ?? ""}
								disabled={local.disabled}
								readOnly={local.readOnly}
								aria-label={`Cron ${name}`}
								aria-invalid={parsed().valid[i()] === false || Boolean(local.error)}
								class={`border bg-surface text-center font-mono tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${inputVariants[local.variant ?? "default"]} ${fieldCls[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${
									parsed().valid[i()] === false || local.error ? "border-destructive" : ""
								}`}
								onInput={(e) => setField(i(), e.currentTarget.value)}
							/>
							<Show when={local.showFieldLabels ?? true}>
								<span class="text-2xs text-muted-foreground">{name}</span>
							</Show>
						</label>
					)}
				</For>
				<Show when={(local.showHint ?? true) && !invalid() && allValid()}>
					<span class="pb-1 pl-2 font-mono text-2xs text-muted-foreground">{local.value}</span>
				</Show>
				<Show when={(local.showHint ?? true) && invalid()}>
					<span class="pb-1 pl-2 text-2xs text-destructive" role="alert">
						{typeof local.error === "string" ? local.error : "Invalid expression"}
					</span>
				</Show>
			</div>
			<Show when={(local.showDescription ?? true) && description()}>
				<div class="mt-1 text-xs text-muted-foreground" aria-live="polite">
					{description()}
				</div>
			</Show>
			<Show when={presets().length}>
				<div class="mt-2 flex flex-wrap gap-1">
					<For each={presets()}>
						{(p) => (
							<button
								type="button"
								disabled={local.disabled || local.readOnly}
								class={`rounded-full border px-2 py-0.5 text-2xs motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
									local.value === p.expression
										? "border-primary bg-primary/10 text-primary"
										: "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
								}`}
								onClick={() => local.onChange?.(p.expression)}
							>
								{p.label}
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
