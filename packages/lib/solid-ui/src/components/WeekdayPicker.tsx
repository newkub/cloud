/**
 * WeekdayPicker - seven-day multi-select toggle row (0 = Sunday … 6 = Saturday).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface WeekdayPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Selected day indices (0 = Sunday). */
	value?: number[];
	/** Called with the next selected indices. */
	onChange?: (days: number[]) => void;
	/** Day labels, short form. @default ["S","M","T","W","T","F","S"] */
	labels?: string[];
	/** Corner radius. */
	radius?: Radius;
}

const DEFAULT_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function WeekdayPicker(props: WeekdayPickerProps) {
	const [local, rest] = splitProps(props, ["class", "value", "onChange", "labels", "radius"]);

	const selected = () => local.value ?? [];
	const labels = () => local.labels ?? DEFAULT_LABELS;

	const toggle = (day: number) => {
		const cur = selected();
		const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day].sort();
		local.onChange?.(next);
	};

	const className = () => ["solidui-weekday-picker inline-flex gap-1", local.class ?? ""].filter(Boolean).join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: weekday toggle group, not a form fieldset
		<div class={className()} role="group" aria-label="Weekdays" {...rest}>
			<For each={labels()}>
				{(lbl, i) => {
					const day = i();
					const active = () => selected().includes(day);
					return (
						<button
							type="button"
							class={`h-8 w-8 text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "full"]} ${
								active()
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-muted-foreground border-input hover:bg-accent"
							}`}
							aria-pressed={active()}
							aria-label={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}
							onClick={() => toggle(day)}
						>
							{lbl}
						</button>
					);
				}}
			</For>
		</div>
	);
}
