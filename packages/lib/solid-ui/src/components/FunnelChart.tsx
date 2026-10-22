/**
 * FunnelChart — centered trapezoid funnel for conversion-style stages.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CHART_PALETTE } from "./DonutChart";

export interface FunnelStage {
	label: string;
	value: number;
	color?: string;
}

export interface FunnelChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stages: FunnelStage[];
	/** Bar height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Show conversion % between stages @default true */
	showConversion?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const barH = { sm: "h-7", md: "h-9", lg: "h-11" } as const;

export function FunnelChart(props: FunnelChartProps) {
	const [local, rest] = splitProps(props, ["class", "stages", "size", "showConversion", "radius", "elevation"]);
	const stages = () => local.stages ?? [];
	const max = () => Math.max(1, ...stages().map((s) => s.value));
	return (
		<div class={`solidui-funnel-chart space-y-1 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={stages()}>
				{(stage, i) => {
					const w = () => Math.max(8, (stage.value / max()) * 100);
					const conv = () =>
						i() > 0 && stages()[i() - 1].value > 0 ? Math.round((stage.value / stages()[i() - 1].value) * 100) : null;
					return (
						<div class="flex flex-col items-center">
							<div
								class={`flex ${barH[local.size ?? "md"]} items-center justify-center gap-2 text-xs font-medium text-primary-foreground transition-all motion-reduce:transition-none ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
								style={{
									width: `${w()}%`,
									"background-color": stage.color ?? CHART_PALETTE[i() % CHART_PALETTE.length],
								}}
							>
								<span class="truncate">{stage.label}</span>
								<span class="font-mono opacity-80">{stage.value}</span>
							</div>
							{(local.showConversion ?? true) && conv() !== null ? (
								<span class="my-0.5 text-2xs text-muted-foreground">↓ {conv()}%</span>
							) : null}
						</div>
					);
				}}
			</For>
		</div>
	);
}
