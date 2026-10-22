/**
 * WaffleChart — 10×10 grid where filled cells show a percentage share.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface WafflePart {
	label: string;
	/** Share 0..1 — rows normalized so parts need not sum to 1. */
	value: number;
}

export interface WaffleChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: WafflePart[];
	radius?: Radius;
	elevation?: Elevation;
}

const palette = [
	"text-primary",
	"text-info",
	"text-success",
	"text-warning",
	"text-destructive",
	"text-muted-foreground",
];

export function WaffleChart(props: WaffleChartProps) {
	const merged = mergeProps({}, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "radius", "elevation"]);

	const cells = () => {
		const parts = local.data ?? [];
		const total = Math.max(
			1e-9,
			parts.reduce((a, p) => a + p.value, 0),
		);
		let filled = 0;
		const grid: { cls: string; i: number }[] = [];
		for (const [pi, p] of parts.entries()) {
			const n = pi === parts.length - 1 ? 100 - filled : Math.round((p.value / total) * 100);
			for (let i = 0; i < n && filled < 100; i++, filled++) grid.push({ cls: palette[pi % palette.length], i: filled });
		}
		while (grid.length < 100) grid.push({ cls: "text-muted", i: grid.length });
		return grid;
	};

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
			<svg class="h-40 w-40" viewBox="0 0 100 100" role="img" aria-label="Waffle chart">
				<For each={cells()}>
					{(c) => (
						<rect
							x={(c.i % 10) * 10 + 1}
							y={Math.floor(c.i / 10) * 10 + 1}
							width="8"
							height="8"
							rx="2"
							fill="currentColor"
							class={c.cls}
						/>
					)}
				</For>
			</svg>
			<ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
				<For each={local.data ?? []}>
					{(p, i) => (
						<li class="flex items-center gap-1.5 text-2xs text-muted-foreground">
							<span
								class={`h-2 w-2 rounded-sm ${palette[i() % palette.length]}`}
								style={{ "background-color": "currentColor" }}
							/>
							{p.label}
						</li>
					)}
				</For>
			</ul>
			{local.children}
		</div>
	);
}
