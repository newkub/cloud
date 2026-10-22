/**
 * HabitGrid - streak grid of habit activity cells; done levels map to tone opacity.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";

export interface HabitWeek {
	/** Per-day values — booleans or completion counts. */
	days: (boolean | number)[];
}

export interface HabitGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Grid heading. */
	title?: string;
	/** Week rows. */
	weeks?: HabitWeek[];
	/** Day column labels. @default ["M","T","W","T","F","S","S"] */
	labels?: string[];
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

/** Cell tone by intensity level 0–4. */
const levelClasses = ["bg-muted", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"] as const;

export function HabitGrid(props: HabitGridProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-habit-grid inline-flex flex-col gap-1.5",
		unstyled: props.unstyled,
	});
	const [local, rest] = splitProps(others, ["title", "weeks", "labels"]);

	const weeks = () => local.weeks ?? [];
	const dayCount = () => weeks().reduce((max, w) => Math.max(max, w.days.length), 0);
	const labels = () => {
		const provided = local.labels ?? ["M", "T", "W", "T", "F", "S", "S"];
		return Array.from({ length: dayCount() }, (_, i) => provided[i] ?? "");
	};
	const maxCount = () =>
		weeks().reduce((max, w) => Math.max(max, ...w.days.map((d) => (typeof d === "number" ? d : 0))), 1);

	const level = (value: boolean | number) => {
		if (typeof value === "boolean") return value ? 4 : 0;
		if (value <= 0) return 0;
		return Math.min(4, Math.ceil((value / maxCount()) * 5));
	};
	const describe = (value: boolean | number) =>
		typeof value === "boolean" ? (value ? "done" : "not done") : `${value} ${value === 1 ? "time" : "times"}`;

	return (
		<div class={className()} {...rest}>
			<Show when={local.title}>
				<div class="text-sm font-semibold text-foreground">{local.title}</div>
			</Show>
			{/* biome-ignore lint/a11y/useSemanticElements: APG grid semantics on divs for layout freedom */}
			<div role="grid" aria-label={local.title ?? "Habit activity"} class="flex flex-col gap-1">
				<Show when={dayCount() > 0}>
					{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/useFocusableInteractive: APG grid row — non-interactive header row */}
					<div role="row" class="flex gap-1">
						<For each={labels()}>
							{(label) => (
								// biome-ignore lint/a11y/useSemanticElements lint/a11y/useFocusableInteractive: APG columnheader inside role=row
								<span
									role="columnheader"
									class="flex h-4 w-4 items-center justify-center text-2xs text-muted-foreground"
								>
									{label}
								</span>
							)}
						</For>
					</div>
				</Show>
				<For each={weeks()}>
					{(week, wi) => (
						// biome-ignore lint/a11y/useSemanticElements lint/a11y/useFocusableInteractive: APG grid row
						<div role="row" class="flex gap-1">
							<For each={week.days}>
								{(day, di) => (
									// biome-ignore lint/a11y/useSemanticElements lint/a11y/useFocusableInteractive: APG gridcell — read-only cell
									<span
										role="gridcell"
										aria-label={`Week ${wi() + 1}, day ${di() + 1}: ${describe(day)}`}
										class={`h-4 w-4 rounded-sm ${levelClasses[level(day)]}`}
									/>
								)}
							</For>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
