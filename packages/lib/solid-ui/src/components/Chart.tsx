/**
 * Chart component — lightweight SVG charts.
 *
 * type: "bar" | "line" | "area" | "scatter" | "pie" | "donut" | "radar" | "gauge"
 */
import { For, mergeProps, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { PieSlices } from "./chart/PieSlices";
import { RadarPolygon } from "./chart/RadarPolygon";
import type { ChartDataPoint, ChartType, ChartVariant } from "./chart/types";
import { colorOf, PAD, variantMap, W, xy } from "./chart/utils";

export type { ChartDataPoint, ChartType } from "./chart/types";

export interface ChartProps {
	data?: ChartDataPoint[];
	type?: ChartType;
	title?: string;
	height?: number;
	variant?: ChartVariant;
	/** Max for gauge — defaults to 100 (percent). */
	maxValue?: number;
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Chart(props: ChartProps) {
	const merged = mergeProps(
		{ data: [] as ChartDataPoint[], height: 256, type: "bar" as ChartType, maxValue: 100 },
		props,
	);
	const max = () => Math.max(1, ...merged.data.map((d) => d.value));
	const type = () => merged.type;

	const gaugeFrac = () => Math.min(1, Math.max(0, (merged.data[0]?.value ?? 0) / merged.maxValue));
	const gaugeArc = () => {
		const r = 80;
		const c = Math.PI * r; // half circumference
		return `${gaugeFrac() * c} ${c}`;
	};

	return (
		<div
			class={`w-full border border-border bg-surface p-4 ${radiusMap[merged.radius ?? "xl"]} ${elevationMap[merged.elevation ?? "sm"]} ${merged.class ?? ""}`}
		>
			<Show when={merged.title}>
				<h3 class="mb-3 text-sm font-semibold text-foreground">{merged.title}</h3>
			</Show>
			<Show when={merged.data.length > 0} fallback={<p class="text-sm text-muted-foreground">No data</p>}>
				<Show when={type() === "bar"}>
					<div class="flex items-end justify-around gap-2" style={{ height: `${merged.height}px` }}>
						<For each={merged.data}>
							{(point) => {
								const h = () => `${(point.value / max()) * 100}%`;
								return (
									<div class="flex flex-1 flex-col items-center gap-1">
										<div
											class={`w-full max-w-12 rounded-t ${variantMap[merged.variant ?? "default"]} transition-all motion-reduce:transition-none`}
											style={{
												height: h(),
												"background-color": point.color ? `hsl(${point.color})` : undefined,
											}}
											role="img"
											aria-label={`${point.label}: ${point.value}`}
										/>
										<span class="text-xs text-muted-foreground">{point.label}</span>
									</div>
								);
							}}
						</For>
					</div>
				</Show>

				<Show when={type() === "line" || type() === "area" || type() === "scatter"}>
					<svg
						viewBox={`0 0 ${W} ${merged.height}`}
						class="w-full"
						style={{ height: `${merged.height}px` }}
						role="img"
						aria-label={
							merged.title ?? `${type()} chart: ${merged.data.map((d) => `${d.label} ${d.value}`).join(", ")}`
						}
					>
						<line x1={PAD} y1={merged.height - PAD} x2={W - PAD} y2={merged.height - PAD} class="stroke-border" />
						<line x1={PAD} y1={PAD} x2={PAD} y2={merged.height - PAD} class="stroke-border" />
						<Show when={type() === "area"}>
							<polygon
								points={`${PAD},${merged.height - PAD} ${xy(merged.data, merged.height)
									.map((p) => `${p.x},${p.y}`)
									.join(" ")} ${W - PAD},${merged.height - PAD}`}
								class="fill-primary/15"
							/>
						</Show>
						<Show when={type() !== "scatter"}>
							<polyline
								points={xy(merged.data, merged.height)
									.map((p) => `${p.x},${p.y}`)
									.join(" ")}
								fill="none"
								class="stroke-primary"
								stroke-width="2"
								stroke-linejoin="round"
							/>
						</Show>
						<For each={xy(merged.data, merged.height)}>
							{(p) => (
								<circle
									cx={p.x}
									cy={p.y}
									r="3"
									fill={colorOf(p.d, merged.data.indexOf(p.d))}
									tabindex="0"
									class="focus-visible:outline-none"
								>
									<title>{`${p.d.label}: ${p.d.value}`}</title>
								</circle>
							)}
						</For>
						<For each={merged.data}>
							{(d, i) => {
								const p = () => xy(merged.data, merged.height)[i()];
								return (
									<text x={p().x} y={merged.height - 6} text-anchor="middle" class="fill-muted-foreground text-[10px]">
										{d.label}
									</text>
								);
							}}
						</For>
					</svg>
				</Show>

				<Show when={type() === "pie" || type() === "donut"}>
					<svg
						viewBox="-110 -110 220 220"
						class="mx-auto max-w-full"
						style={{ height: `${merged.height}px` }}
						role="img"
						aria-label={
							merged.title ?? `${type()} chart: ${merged.data.map((d) => `${d.label} ${d.value}`).join(", ")}`
						}
					>
						<title>{merged.title ?? "Pie chart"}</title>
						<PieSlices data={merged.data} r={80} hole={type() === "donut" ? 45 : 0} />
						<Show when={type() === "donut"}>
							<text x={0} y={4} text-anchor="middle" class="fill-foreground text-sm font-semibold">
								{merged.data.reduce((s, d) => s + d.value, 0)}
							</text>
						</Show>
					</svg>
					<ul class="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
						<For each={merged.data}>
							{(d, i) => (
								<li class="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span class="h-2 w-2 rounded-full" style={{ "background-color": colorOf(d, i()) }} />
									{d.label}
								</li>
							)}
						</For>
					</ul>
				</Show>

				<Show when={type() === "radar"}>
					<svg
						viewBox={`0 0 ${merged.height + 40} ${merged.height + 40}`}
						class="mx-auto max-w-full"
						style={{ height: `${merged.height}px` }}
						role="img"
						aria-label={merged.title ?? `Radar chart: ${merged.data.map((d) => `${d.label} ${d.value}`).join(", ")}`}
					>
						<title>{merged.title ?? "Radar chart"}</title>
						<RadarPolygon data={merged.data} size={merged.height + 40} />
					</svg>
				</Show>

				<Show when={type() === "gauge"}>
					<svg
						viewBox="0 0 200 110"
						class="mx-auto max-w-full"
						style={{ height: `${merged.height}px` }}
						role="img"
						aria-label={
							merged.title ??
							`Gauge chart: ${merged.data[0]?.label ?? "value"} ${merged.data[0]?.value ?? 0} of ${merged.maxValue}`
						}
					>
						<title>{merged.title ?? "Gauge chart"}</title>
						<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" class="stroke-muted" stroke-width="14" />
						<path
							d="M 20 100 A 80 80 0 0 1 180 100"
							fill="none"
							class="stroke-primary"
							stroke-width="14"
							stroke-dasharray={gaugeArc()}
							stroke-linecap="round"
						/>
						<text x={100} y={92} text-anchor="middle" class="fill-foreground text-lg font-bold">
							{merged.data[0]?.value ?? 0}
						</text>
						<text x={100} y={106} text-anchor="middle" class="fill-muted-foreground text-[10px]">
							{merged.data[0]?.label ?? `of ${merged.maxValue}`}
						</text>
					</svg>
				</Show>
			</Show>
		</div>
	);
}
