/**
 * HeatmapCalendar — GitHub-style contribution calendar (weeks x days intensity cells).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius } from "../lib/variants";

export interface HeatmapDatum {
	/** ISO date string (YYYY-MM-DD). */
	date: string;
	/** Intensity value — mapped onto the level scale. */
	value: number;
}

export interface HeatmapCalendarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data: HeatmapDatum[];
	/** Number of trailing weeks to render. @default 26 */
	weeks?: number;
	/** End date — the calendar's last column contains this day. @default today */
	endDate?: Date | string;
	/** Value boundaries for levels 1..maxLevel-1 (level 0 = empty). */
	thresholds?: number[];
	/** Intensity scale colors, index 0 = empty cell. */
	colors?: string[];
	/** Show "Less → More" legend. @default true */
	showLegend?: boolean;
	/** Show weekday labels (Mon/Wed/Fri). */
	showDayLabels?: boolean;
	/** Cell click handler. */
	onCellClick?: (datum: HeatmapDatum) => void;
	/** Cell size preset. */
	size?: "sm" | "md" | "lg";
	/** Corner radius on cells. */
	radius?: Radius;
	/** Shadow elevation on the container. */
	elevation?: Elevation;
}

const cellSize = { sm: "h-2.5 w-2.5", md: "h-3 w-3", lg: "h-4 w-4" } as const;
const cellRadius = {
	none: "rounded-none",
	sm: "rounded-[2px]",
	md: "rounded-[3px]",
	lg: "rounded",
	xl: "rounded",
	"2xl": "rounded-md",
	"3xl": "rounded-md",
	full: "rounded-full",
} as const;
const defaultColors = ["bg-muted/40", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];
const defaultThresholds = [1, 4, 8];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function toIso(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function levelFor(value: number, thresholds: number[], maxLevel: number): number {
	let level = 0;
	for (const t of thresholds) if (value >= t) level++;
	return Math.min(level, maxLevel);
}

export function HeatmapCalendar(props: HeatmapCalendarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"weeks",
		"endDate",
		"thresholds",
		"colors",
		"showLegend",
		"showDayLabels",
		"onCellClick",
		"size",
		"radius",
		"elevation",
	]);

	const colors = () => local.colors ?? defaultColors;
	const thresholds = () => local.thresholds ?? defaultThresholds;
	const byDate = () => new Map((local.data ?? []).map((d) => [d.date, d.value]));

	// Build columns of 7 days ending on endDate's week.
	const weeks = () => {
		const end = local.endDate ? new Date(local.endDate) : new Date();
		// walk back to the start of end's week (Sunday)
		const endWeek = new Date(end);
		endWeek.setDate(end.getDate() - end.getDay());
		const count = local.weeks ?? 26;
		const cols: HeatmapDatum[][] = [];
		for (let w = count - 1; w >= 0; w--) {
			const colStart = new Date(endWeek);
			colStart.setDate(endWeek.getDate() - w * 7);
			const col: HeatmapDatum[] = [];
			for (let d = 0; d < 7; d++) {
				const day = new Date(colStart);
				day.setDate(colStart.getDate() + d);
				const iso = toIso(day);
				if (day > end) {
					col.push({ date: iso, value: -1 }); // future — rendered empty
				} else {
					col.push({ date: iso, value: byDate().get(iso) ?? 0 });
				}
			}
			cols.push(col);
		}
		return cols;
	};

	const cellCls = (d: HeatmapDatum) =>
		d.value < 0
			? "bg-transparent"
			: (colors()[levelFor(d.value, thresholds(), colors().length - 1)] ?? colors()[colors().length - 1]);

	return (
		<div
			class={`solidui-heatmap-calendar inline-flex gap-1 ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.showDayLabels}>
				<div class={`flex flex-col justify-between py-0.5 pr-1 text-2xs text-muted-foreground`}>
					<For each={DAY_LABELS}>{(l) => <span class={cellSize[local.size ?? "md"]}>{l}</span>}</For>
				</div>
			</Show>
			<For each={weeks()}>
				{(week) => (
					<div class="flex flex-col gap-1">
						<For each={week}>
							{(d) => (
								// biome-ignore lint/a11y/noStaticElementInteractions: role/tabindex applied only when clickable
								<div
									role={local.onCellClick && d.value >= 0 ? "button" : undefined}
									tabIndex={local.onCellClick && d.value >= 0 ? 0 : undefined}
									class={`${cellSize[local.size ?? "md"]} ${cellRadius[local.radius ?? "sm"]} ${cellCls(d)} ${
										local.onCellClick && d.value >= 0
											? "cursor-pointer hover:ring-1 hover:ring-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
											: ""
									}`}
									title={d.value >= 0 ? `${d.date}: ${d.value}` : undefined}
									onClick={() => d.value >= 0 && local.onCellClick?.(d)}
									onKeyDown={(e) => {
										if ((e.key === "Enter" || e.key === " ") && d.value >= 0) {
											e.preventDefault();
											local.onCellClick?.(d);
										}
									}}
								/>
							)}
						</For>
					</div>
				)}
			</For>
			<Show when={local.showLegend ?? true}>
				<div class="ml-2 flex items-end gap-0.5 self-end text-2xs text-muted-foreground">
					<span class="mr-1">Less</span>
					<For each={colors()}>
						{(c) => <span class={`${cellSize[local.size ?? "md"]} ${cellRadius[local.radius ?? "sm"]} ${c}`} />}
					</For>
					<span class="ml-1">More</span>
				</div>
			</Show>
		</div>
	);
}
