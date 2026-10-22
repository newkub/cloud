/**
 * SlopeChart — parallel slopes between two time points; highlights rank/direction changes.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SlopeItem {
	label: string;
	from: number;
	to: number;
}

export interface SlopeChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: SlopeItem[];
	/** Column headers. @default ["From","To"] */
	periods?: [string, string];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function SlopeChart(props: SlopeChartProps) {
	const merged = mergeProps({ periods: ["From", "To"] as [string, string], width: 360, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"data",
		"periods",
		"width",
		"height",
		"radius",
		"elevation",
		"children",
	]);

	const extent = () => {
		const all = (local.data ?? []).flatMap((d) => [d.from, d.to]);
		const min = Math.min(0, ...all);
		const max = Math.max(1, ...all);
		return { min, span: max - min || 1 };
	};

	const y = (v: number) => {
		const { min, span } = extent();
		return local.height - 28 - ((v - min) / span) * (local.height - 48);
	};

	const lx = 60;
	const rx = () => local.width - 60;

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Slope chart">
				<text x={lx} y={14} text-anchor="middle" font-size="10" class="fill-muted-foreground font-semibold">
					{local.periods[0]}
				</text>
				<text x={rx()} y={14} text-anchor="middle" font-size="10" class="fill-muted-foreground font-semibold">
					{local.periods[1]}
				</text>
				<For each={local.data ?? []}>
					{(d) => {
						const up = d.to >= d.from;
						return (
							<g>
								<line
									x1={lx}
									y1={y(d.from)}
									x2={rx()}
									y2={y(d.to)}
									stroke="currentColor"
									stroke-width="2"
									class={up ? "text-primary" : "text-destructive"}
								/>
								<circle
									cx={lx}
									cy={y(d.from)}
									r="3"
									fill="currentColor"
									class={up ? "text-primary" : "text-destructive"}
								/>
								<circle
									cx={rx()}
									cy={y(d.to)}
									r="3"
									fill="currentColor"
									class={up ? "text-primary" : "text-destructive"}
								/>
								<text x={lx - 8} y={y(d.from) + 3} text-anchor="end" font-size="9" class="fill-foreground">
									{d.label}
								</text>
								<text x={rx() + 8} y={y(d.to) + 3} font-size="9" class="fill-muted-foreground tabular-nums">
									{d.to}
								</text>
							</g>
						);
					}}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
