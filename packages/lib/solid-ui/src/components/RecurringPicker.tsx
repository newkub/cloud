/**
 * RecurringPicker - recurrence pattern selector (daily/weekly/monthly) with interval.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { WeekdayPicker } from "./WeekdayPicker";

export type RecurrenceFreq = "none" | "daily" | "weekly" | "monthly";

export interface RecurringValue {
	freq: RecurrenceFreq;
	interval: number;
	/** Weekday indices for weekly recurrence. */
	days?: number[];
}

export interface RecurringPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current recurrence value. */
	value?: RecurringValue;
	/** Called with the next recurrence value. */
	onChange?: (value: RecurringValue) => void;
}

const FREQS: { id: RecurrenceFreq; label: string }[] = [
	{ id: "none", label: "Does not repeat" },
	{ id: "daily", label: "Daily" },
	{ id: "weekly", label: "Weekly" },
	{ id: "monthly", label: "Monthly" },
];

export function RecurringPicker(props: RecurringPickerProps) {
	const [local, rest] = splitProps(props, ["class", "value", "onChange"]);

	const val = () => local.value ?? { freq: "none" as RecurrenceFreq, interval: 1 };

	const setFreq = (freq: RecurrenceFreq) => local.onChange?.({ ...val(), freq });
	const setInterval = (n: number) => local.onChange?.({ ...val(), interval: Math.max(1, n) });
	const setDays = (days: number[]) => local.onChange?.({ ...val(), days });

	const className = () => ["solidui-recurring-picker flex flex-col gap-3", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			{/* biome-ignore lint/a11y/useSemanticElements: segmented control, not a form fieldset */}
			<div class="flex flex-wrap gap-1" role="group" aria-label="Recurrence frequency">
				<For each={FREQS}>
					{(f) => (
						<button
							type="button"
							class={`h-8 px-3 text-xs font-medium rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
								val().freq === f.id
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-muted-foreground border-input hover:bg-accent"
							}`}
							aria-pressed={val().freq === f.id}
							onClick={() => setFreq(f.id)}
						>
							{f.label}
						</button>
					)}
				</For>
			</div>
			<Show when={val().freq !== "none"}>
				<label class="flex items-center gap-2 text-sm text-muted-foreground">
					Every
					<input
						type="number"
						min={1}
						max={99}
						class="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
						value={val().interval}
						onInput={(e) => setInterval(Number.parseInt(e.currentTarget.value, 10) || 1)}
					/>
					{val().freq === "daily" ? "day(s)" : val().freq === "weekly" ? "week(s)" : "month(s)"}
				</label>
			</Show>
			<Show when={val().freq === "weekly"}>
				<WeekdayPicker value={val().days ?? []} onChange={setDays} />
			</Show>
		</div>
	);
}
