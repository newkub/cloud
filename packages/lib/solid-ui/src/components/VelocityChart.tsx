/**
 * VelocityChart — per-sprint committed vs completed bars with an average-completed line.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface VelocitySprint {
	/** Sprint name */
	label: string;
	/** Points committed */
	committed: number;
	/** Points completed */
	completed: number;
}

export interface VelocityChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Sprints to plot */
	sprints: VelocitySprint[];
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 160 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 14;
const PAD_TOP = 12;
const PAD_BOTTOM = 18;

export function VelocityChart(props: VelocityChartProps) {
	const merged = mergeProps({ width: 320, height: 160 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "sprints", "width", "height", "radius", "elevation"]);

	const base = () => local.height - PAD_BOTTOM;
	const maxV = () => Math.max(1, ...(local.sprints ?? []).flatMap((s) => [s.committed, s.completed]));
	const avg = () => {
		const s = local.sprints ?? [];
		return s.length ? s.reduce((t, x) => t + x.completed, 0) / s.length : 0;
	};
	const slot = () => (local.width - PAD_X * 2) / Math.max(1, (local.sprints ?? []).length);
	const barW = () => Math.max(4, slot() * 0.3);
	const y = (v: number) => base() - (v / maxV()) * (base() - PAD_TOP);

	return (
		<div
			class={[
				"solidui-velocity-chart inline-block",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				width={local.width}
				height={local.height}
				viewBox={`0 0 ${local.width} ${local.height}`}
				class="max-w-full"
				role="img"
				aria-label={`Velocity: ${(local.sprints ?? []).length} sprints, average ${avg().toFixed(1)} completed`}
			>
				<line x1={PAD_X} y1={base()} x2={local.width - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<line
					x1={PAD_X}
					y1={y(avg())}
					x2={local.width - PAD_X}
					y2={y(avg())}
					class="stroke-info"
					stroke-width="1.5"
					stroke-dasharray="4 3"
				/>
				<For each={local.sprints ?? []}>
					{(s, i) => {
						const gx = () => PAD_X + i() * slot() + slot() / 2;
						return (
							<>
								<rect
									x={gx() - barW() - 1}
									y={y(s.committed)}
									width={barW()}
									height={Math.max(0, base() - y(s.committed))}
									class="fill-muted-foreground/40"
									rx="1"
								/>
								<rect
									x={gx() + 1}
									y={y(s.completed)}
									width={barW()}
									height={Math.max(0, base() - y(s.completed))}
									class="fill-primary"
									rx="1"
								/>
								<text x={gx()} y={local.height - 4} text-anchor="middle" font-size="8" class="fill-muted-foreground">
									{s.label}
								</text>
							</>
						);
					}}
				</For>
			</svg>
			<div class="mt-1 flex items-center gap-3 text-2xs text-muted-foreground">
				<span class="inline-flex items-center gap-1">
					<span class="h-2 w-2 rounded-sm bg-muted-foreground/40" /> Committed
				</span>
				<span class="inline-flex items-center gap-1">
					<span class="h-2 w-2 rounded-sm bg-primary" /> Completed
				</span>
				<span class="inline-flex items-center gap-1">
					<span class="h-0.5 w-3 bg-info" /> Avg
				</span>
			</div>
			{local.children}
		</div>
	);
}
