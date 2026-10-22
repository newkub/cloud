/**
 * RolloutChart — stepped area chart of deploy rollout percent per stage/region.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RolloutStage {
	/** Stage or region label */
	label: string;
	/** Rollout percent 0..100 */
	pct: number;
}

export interface RolloutChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Rollout stages in order */
	stages: RolloutStage[];
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 140 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 12;
const PAD_TOP = 14;
const PAD_BOTTOM = 18;

export function RolloutChart(props: RolloutChartProps) {
	const merged = mergeProps({ width: 320, height: 140 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "stages", "width", "height", "radius", "elevation"]);

	const base = () => local.height - PAD_BOTTOM;
	const step = () => (local.width - PAD_X * 2) / Math.max(1, (local.stages ?? []).length);
	const x = (i: number) => PAD_X + i * step();
	const y = (pct: number) => base() - (Math.min(100, Math.max(0, pct)) / 100) * (base() - PAD_TOP);

	const stepPath = () => {
		const stages = local.stages ?? [];
		if (!stages.length) return "";
		let d = `M${x(0).toFixed(1)},${y(stages[0].pct).toFixed(1)}`;
		for (let i = 1; i < stages.length; i++) {
			d += ` L${x(i).toFixed(1)},${y(stages[i - 1].pct).toFixed(1)} L${x(i).toFixed(1)},${y(stages[i].pct).toFixed(1)}`;
		}
		d += ` L${x(stages.length).toFixed(1)},${y(stages[stages.length - 1].pct).toFixed(1)}`;
		return d;
	};
	const areaPath = () => {
		const stages = local.stages ?? [];
		if (!stages.length) return "";
		return `${stepPath()} L${x(stages.length).toFixed(1)},${base()} L${x(0).toFixed(1)},${base()} Z`;
	};

	return (
		<div
			class={[
				"solidui-rollout-chart inline-block",
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
				aria-label={`Rollout: ${(local.stages ?? []).map((s) => `${s.label} ${s.pct}%`).join(", ")}`}
			>
				<line x1={PAD_X} y1={base()} x2={local.width - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<line
					x1={PAD_X}
					y1={y(100)}
					x2={local.width - PAD_X}
					y2={y(100)}
					class="stroke-border"
					stroke-width="0.5"
					stroke-dasharray="3 3"
				/>
				<path d={areaPath()} class="fill-primary/15" />
				<path d={stepPath()} fill="none" class="stroke-primary" stroke-width="2" stroke-linejoin="round" />
				<For each={local.stages ?? []}>
					{(s, i) => (
						<>
							<text
								x={x(i()) + step() / 2}
								y={y(s.pct) - 4}
								text-anchor="middle"
								font-size="8"
								class="fill-primary font-medium tabular-nums"
							>
								{s.pct}%
							</text>
							<text
								x={x(i()) + step() / 2}
								y={local.height - 4}
								text-anchor="middle"
								font-size="8"
								class="fill-muted-foreground"
							>
								{s.label}
							</text>
						</>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
