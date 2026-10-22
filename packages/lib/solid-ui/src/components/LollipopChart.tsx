/**
 * LollipopChart — thin stem + dot marker per value. Lighter alternative to bars.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LollipopChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	labels?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function LollipopChart(props: LollipopChartProps) {
	const merged = mergeProps({ width: 400, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"labels",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const items = () => {
		const data = local.data ?? [];
		const max = Math.max(1, ...data);
		const pad = 12;
		const stepX = data.length > 1 ? (local.width - pad * 2) / (data.length - 1) : 0;
		const baseY = local.height - 16;
		return data.map((v, i) => ({
			x: data.length > 1 ? pad + i * stepX : local.width / 2,
			y: baseY - (v / max) * (local.height - pad - 24),
			baseY,
			v,
			label: local.labels?.[i],
		}));
	};

	return (
		<div
			class={[
				"w-full text-primary",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-40 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Lollipop chart">
				<line
					x1={8}
					x2={local.width - 8}
					y1={local.height - 16}
					y2={local.height - 16}
					stroke="currentColor"
					class="text-border"
				/>
				<For each={items()}>
					{(it) => (
						<g>
							<line x1={it.x} x2={it.x} y1={it.baseY} y2={it.y} stroke="currentColor" stroke-width="2" opacity="0.5" />
							<circle cx={it.x} cy={it.y} r="5" fill="currentColor" />
							{it.label !== undefined && (
								<text x={it.x} y={local.height - 4} text-anchor="middle" class="fill-muted-foreground" font-size="8">
									{it.label}
								</text>
							)}
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
