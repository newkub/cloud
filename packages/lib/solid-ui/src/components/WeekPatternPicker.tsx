/**
 * WeekPatternPicker - per-day availability toggles with start/end hour inputs.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";

export interface WeekPatternEntry {
	/** Day indices this range applies to (0 = Sunday … 6 = Saturday). */
	days: number[];
	/** Start hour 0-23 inclusive. */
	start: number;
	/** End hour 0-24 exclusive. */
	end: number;
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface WeekPatternPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Active day ranges. */
	value?: WeekPatternEntry[];
	onChange?: (entries: WeekPatternEntry[]) => void;
	/** Visible group label. @default "Weekly schedule" */
	label?: JSX.Element;
	/** Hour bounds for the number inputs. @default {min:0, max:24} */
	minHour?: number;
	maxHour?: number;
	disabled?: boolean;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function WeekPatternPicker(props: WeekPatternPickerProps) {
	const [local, others] = splitProps(props, ["value", "onChange", "label", "minHour", "maxHour", "disabled"]);
	const { className, rest } = useComponentClasses(others, {
		base: "solidui-week-pattern-picker w-full",
	});
	const value = () => local.value ?? [];
	const minHour = () => local.minHour ?? 0;
	const maxHour = () => local.maxHour ?? 24;
	const entryFor = (day: number) => value().find((e) => e.days.includes(day));

	const setDay = (day: number, patch: Partial<WeekPatternEntry> & { enabled?: boolean }) => {
		const current = entryFor(day);
		const next = value()
			.map((e) => ({ ...e, days: e.days.filter((d) => d !== day) }))
			.filter((e) => e.days.length);
		const enabled = patch.enabled ?? !!current;
		if (enabled) {
			next.push({
				days: [day],
				start: patch.start ?? current?.start ?? 9,
				end: patch.end ?? current?.end ?? 17,
			});
		}
		local.onChange?.(next);
	};

	const toggleCls = (on: boolean) =>
		`rounded border px-1.5 py-0.5 text-2xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
			on
				? "border-primary/30 bg-primary/10 text-primary"
				: "border-border bg-transparent text-muted-foreground hover:bg-muted"
		}`;

	const hourCls = (on: boolean) =>
		`h-7 w-14 border bg-background px-1 text-center text-xs tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded ${
			on ? "border-input" : "border-border"
		}`;

	return (
		<div class={className()} {...rest}>
			<Show when={local.label ?? "Weekly schedule"}>
				<span class="mb-1 block text-sm font-medium text-foreground">{local.label ?? "Weekly schedule"}</span>
			</Show>
			{/* biome-ignore lint/a11y/useSemanticElements: labelled day-picker group, not a form fieldset */}
			<div class="flex flex-col gap-1" role="group" aria-label="Days of the week">
				<For each={DAY_NAMES}>
					{(name, i) => {
						const day = i();
						const entry = () => entryFor(day);
						const on = () => !!entry();
						return (
							<div class="flex items-center gap-2">
								<button
									type="button"
									class={`${toggleCls(on())} w-14 text-left`}
									aria-pressed={on()}
									aria-label={`Toggle ${name}`}
									disabled={local.disabled}
									onClick={() => setDay(day, { enabled: !on() })}
								>
									{DAY_SHORT[day]}
								</button>
								<Show when={on()} fallback={<span class="text-xs text-muted-foreground">Off</span>}>
									<input
										type="number"
										class={hourCls(true)}
										min={minHour()}
										max={maxHour()}
										value={entry()?.start ?? 9}
										disabled={local.disabled}
										aria-label={`${name} start hour`}
										onInput={(e) => {
											const v = Number(e.currentTarget.value);
											if (Number.isFinite(v)) setDay(day, { start: v });
										}}
									/>
									<span class="text-xs text-muted-foreground">–</span>
									<input
										type="number"
										class={hourCls(true)}
										min={minHour()}
										max={maxHour()}
										value={entry()?.end ?? 17}
										disabled={local.disabled}
										aria-label={`${name} end hour`}
										onInput={(e) => {
											const v = Number(e.currentTarget.value);
											if (Number.isFinite(v)) setDay(day, { end: v });
										}}
									/>
									<span class="text-2xs text-muted-foreground tabular-nums">
										{entry()?.start ?? 9}:00–{entry()?.end ?? 17}:00
									</span>
								</Show>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
