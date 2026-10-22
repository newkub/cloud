/**
 * GanttChart — task bars on a day-scale timeline.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface GanttTask {
	/** Task name shown in the left column */
	label: string;
	/** Start day index (0-based) */
	start: number;
	/** Duration in days */
	duration: number;
	/** Bar tone @default "primary" */
	tone?: "primary" | "success" | "warning" | "destructive" | "info";
}

export interface GanttChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Tasks to plot */
	tasks: GanttTask[];
	/** Total day columns @default auto (max task end) */
	days?: number;
	/** Chart density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" } as const;
const toneBar: Record<NonNullable<GanttTask["tone"]>, string> = {
	primary: "fill-primary/70",
	success: "fill-success/70",
	warning: "fill-warning/70",
	destructive: "fill-destructive/70",
	info: "fill-info/70",
};

const LABEL_W = 120;
const COL_W = 26;
const ROW_H = 30;
const HEAD_H = 22;
const PAD = 8;

export function GanttChart(props: GanttChartProps) {
	const [local, rest] = splitProps(props, ["class", "tasks", "days", "size", "radius", "elevation"]);
	const tasks = () => local.tasks ?? [];
	const totalDays = () => local.days ?? Math.max(1, ...tasks().map((t) => t.start + t.duration));
	const width = () => LABEL_W + totalDays() * COL_W + PAD * 2;
	const height = () => HEAD_H + tasks().length * ROW_H + PAD * 2;
	return (
		<div
			class={`solidui-gantt-chart ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${width()} ${height()}`}
				class="h-auto w-full"
				role="img"
				aria-label={`Gantt chart: ${tasks()
					.map((t) => `${t.label} (day ${t.start + 1}–${t.start + t.duration})`)
					.join(", ")}`}
			>
				<For each={Array.from({ length: totalDays() }, (_, d) => d)}>
					{(d) => (
						<g>
							<line
								x1={LABEL_W + d * COL_W}
								y1={HEAD_H}
								x2={LABEL_W + d * COL_W}
								y2={height() - PAD}
								class="stroke-border"
								stroke-width="0.5"
							/>
							<text
								x={LABEL_W + d * COL_W + COL_W / 2}
								y={HEAD_H - 6}
								text-anchor="middle"
								class="fill-muted-foreground"
								font-size="9"
							>
								{d + 1}
							</text>
						</g>
					)}
				</For>
				<For each={tasks()}>
					{(task, i) => (
						<g>
							<text
								x={LABEL_W - 8}
								y={HEAD_H + i() * ROW_H + ROW_H / 2}
								dy="0.35em"
								text-anchor="end"
								class="fill-foreground"
								font-size="11"
							>
								{task.label}
							</text>
							<rect
								x={LABEL_W + task.start * COL_W + 2}
								y={HEAD_H + i() * ROW_H + 6}
								width={task.duration * COL_W - 4}
								height={ROW_H - 12}
								rx={4}
								class={toneBar[task.tone ?? "primary"]}
							/>
						</g>
					)}
				</For>
			</svg>
		</div>
	);
}
