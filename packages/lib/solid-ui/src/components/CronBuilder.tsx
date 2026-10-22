/**
 * CronBuilder - visual 5-field cron editor with segmented selects, presets, and a schedule preview.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { describeCron, parseCron } from "./CronInput";

export interface CronBuilderPreset {
	label: string;
	expression: string;
}

export const CRON_BUILDER_PRESETS: CronBuilderPreset[] = [
	{ label: "Every minute", expression: "* * * * *" },
	{ label: "Hourly", expression: "0 * * * *" },
	{ label: "Daily", expression: "0 0 * * *" },
	{ label: "Weekly", expression: "0 0 * * 1" },
];

const FIELD_NAMES = ["minute", "hour", "day of month", "month", "day of week"] as const;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface FieldOption {
	value: string;
	label: string;
}

const every = (label: string): FieldOption => ({ value: "*", label: `Every ${label}` });

function fieldOptions(i: number): FieldOption[] {
	switch (i) {
		case 0:
			return [
				every("minute"),
				{ value: "*/5", label: "Every 5 min" },
				{ value: "*/10", label: "Every 10 min" },
				{ value: "*/15", label: "Every 15 min" },
				{ value: "*/30", label: "Every 30 min" },
				...Array.from({ length: 60 }, (_, n) => ({ value: String(n), label: `:${String(n).padStart(2, "0")}` })),
			];
		case 1:
			return [
				every("hour"),
				...Array.from({ length: 24 }, (_, n) => ({ value: String(n), label: `${String(n).padStart(2, "0")}:00` })),
			];
		case 2:
			return [every("day"), ...Array.from({ length: 31 }, (_, n) => ({ value: String(n + 1), label: `Day ${n + 1}` }))];
		case 3:
			return [every("month"), ...MONTH_NAMES.map((name, n) => ({ value: String(n + 1), label: name }))];
		default:
			return [
				every("weekday"),
				{ value: "1-5", label: "Weekdays" },
				{ value: "0,6", label: "Weekends" },
				...DOW_NAMES.map((name, n) => ({ value: String(n), label: name })),
			];
	}
}

export interface CronBuilderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput"> {
	/** Cron expression (5 fields). @default "* * * * *" */
	value?: string;
	onChange?: (expression: string) => void;
	/** Quick-pick preset buttons. @default CRON_BUILDER_PRESETS — pass [] to hide. */
	presets?: CronBuilderPreset[];
	/** Visible label for the select group. */
	label?: JSX.Element;
	/** Show the human-readable preview line. @default true */
	showPreview?: boolean;
	/** Corner radius for the selects. */
	radius?: Radius;
	disabled?: boolean;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CronBuilder(props: CronBuilderProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"presets",
		"label",
		"showPreview",
		"radius",
		"disabled",
		"unstyled",
	]);
	const expression = () => local.value ?? "* * * * *";
	const fields = () => {
		const parsed = parseCron(expression()).fields;
		while (parsed.length < 5) parsed.push("*");
		return parsed;
	};
	const presets = () => local.presets ?? CRON_BUILDER_PRESETS;
	const preview = () => describeCron(expression(), presets()) ?? "Custom schedule";

	const setField = (i: number, v: string) => {
		const next = [...fields()];
		next[i] = v || "*";
		local.onChange?.(next.join(" "));
	};

	const selectCls = () =>
		local.unstyled
			? ""
			: `border border-input bg-background text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-1.5 text-xs ${radiusMap[local.radius ?? "md"]}`;

	const optionsFor = (i: number) => {
		const options = fieldOptions(i);
		const current = fields()[i];
		return options.some((o) => o.value === current) ? options : [...options, { value: current, label: current }];
	};

	return (
		<div class={`solidui-cron-builder ${local.unstyled ? (local.class ?? "") : (local.class ?? "")}`.trim()} {...rest}>
			<Show when={local.label}>
				<span class="mb-1 block text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			{/* biome-ignore lint/a11y/useSemanticElements: labelled field group, not a form fieldset */}
			<div class="flex flex-wrap items-end gap-1.5" role="group" aria-label="Cron fields">
				<For each={FIELD_NAMES}>
					{(name, i) => (
						<label class="flex flex-col gap-0.5">
							<select
								class={selectCls()}
								value={fields()[i()]}
								disabled={local.disabled}
								aria-label={`Cron ${name}`}
								onChange={(e) => setField(i(), e.currentTarget.value)}
							>
								<For each={optionsFor(i())}>{(o) => <option value={o.value}>{o.label}</option>}</For>
							</select>
							<span class="text-center text-2xs text-muted-foreground">{name}</span>
						</label>
					)}
				</For>
			</div>
			<Show when={local.showPreview ?? true}>
				<p class="mt-1.5 text-xs text-muted-foreground" aria-live="polite">
					<span class="font-medium text-foreground">{preview()}</span>{" "}
					<code class="font-mono text-2xs">{expression()}</code>
				</p>
			</Show>
			<Show when={presets().length}>
				<div class="mt-2 flex flex-wrap gap-1">
					<For each={presets()}>
						{(p) => (
							<button
								type="button"
								disabled={local.disabled}
								class={`rounded-full border px-2 py-0.5 text-2xs motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
									expression() === p.expression
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
