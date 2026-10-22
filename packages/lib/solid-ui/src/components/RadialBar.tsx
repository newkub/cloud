/**
 * RadialBar — concentric SVG progress arcs with a label/value legend.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CHART_PALETTE } from "./DonutChart";

export interface RadialBarItem {
	/** Ring label */
	label: string;
	/** Current value */
	value: number;
	/** Ring maximum @default 100 */
	max?: number;
	/** Ring color — CSS color; defaults cycle the theme palette */
	color?: string;
}

export interface RadialBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Rings, outermost first */
	data: RadialBarItem[];
	/** Accessible label for the svg */
	label?: string;
	/** Chart size in px @default 160 */
	size?: number;
	/** Ring thickness in px @default 10 */
	thickness?: number;
	/** Show values in the legend @default true */
	showValues?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const GAP = 4;

export function RadialBar(props: RadialBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"label",
		"size",
		"thickness",
		"showValues",
		"radius",
		"elevation",
	]);
	const size = () => local.size ?? 160;
	const th = () => local.thickness ?? 10;
	const rings = () =>
		(local.data ?? []).map((d, i) => {
			const r = size() / 2 - th() / 2 - i * (th() + GAP);
			const c = 2 * Math.PI * r;
			const frac = Math.min(1, Math.max(0, d.value / (d.max ?? 100)));
			return {
				...d,
				color: d.color ?? CHART_PALETTE[i % CHART_PALETTE.length],
				r,
				dash: `${frac * c} ${c}`,
			};
		});
	return (
		<div
			class={`solidui-radial-bar inline-flex items-center gap-4 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={size()}
				height={size()}
				viewBox={`0 0 ${size()} ${size()}`}
				class="max-w-full"
				role="img"
				aria-label={
					local.label ??
					`Radial bar: ${(local.data ?? []).map((d) => `${d.label} ${d.value}/${d.max ?? 100}`).join(", ")}`
				}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<For each={rings()}>
					{(ring) => (
						<g>
							<circle
								cx={size() / 2}
								cy={size() / 2}
								r={Math.max(0, ring.r)}
								fill="none"
								class="stroke-muted"
								stroke-width={th()}
							/>
							<circle
								cx={size() / 2}
								cy={size() / 2}
								r={Math.max(0, ring.r)}
								fill="none"
								stroke={ring.color}
								stroke-width={th()}
								stroke-dasharray={ring.dash}
								stroke-linecap="round"
								transform={`rotate(-90 ${size() / 2} ${size() / 2})`}
								class="transition-all motion-reduce:transition-none"
							>
								<title>{`${ring.label}: ${ring.value}/${ring.max ?? 100}`}</title>
							</circle>
						</g>
					)}
				</For>
			</svg>
			<ul class="space-y-1">
				<For each={rings()}>
					{(ring) => (
						<li class="flex items-center gap-1.5 text-xs">
							<span class="h-2.5 w-2.5 rounded-sm" style={{ "background-color": ring.color }} />
							<span class="text-muted-foreground">{ring.label}</span>
							<Show when={local.showValues ?? true}>
								<span class="font-medium tabular-nums">
									{ring.value}
									<span class="text-muted-foreground">/{ring.max ?? 100}</span>
								</span>
							</Show>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
