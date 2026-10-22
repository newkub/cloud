/**
 * ForceDirectedGraph — node-link layout with curved links; nodes placed on a deterministic ring + jitter.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ForceNode {
	id: string;
	label?: string;
	/** Group index → color. */
	group?: number;
}

export interface ForceDirectedGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	nodes?: ForceNode[];
	links?: [string, string][];
	size?: number;
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

export function ForceDirectedGraph(props: ForceDirectedGraphProps) {
	const merged = mergeProps({ size: 240 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "nodes", "links", "size", "radius", "elevation"]);

	const view = () => {
		const nodes = local.nodes ?? [];
		const c = local.size / 2;
		const r = c - 30;
		// deterministic ring + golden-angle spiral offset
		const pos = new Map(
			nodes.map((n, i) => {
				const a = (i / Math.max(1, nodes.length)) * Math.PI * 2;
				const jr = r * (0.45 + 0.55 * ((i * 0.618) % 1));
				return [n.id, { x: c + jr * Math.cos(a), y: c + jr * Math.sin(a) }];
			}),
		);
		const links = (local.links ?? [])
			.map(([s, t]) => {
				const a = pos.get(s);
				const b = pos.get(t);
				if (!a || !b) return null;
				const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.2;
				const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.2;
				return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
			})
			.filter(Boolean) as string[];
		return { pos, links };
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
			<svg
				class="mx-auto"
				width={local.size}
				height={local.size}
				viewBox={`0 0 ${local.size} ${local.size}`}
				role="img"
				aria-label="Force directed graph"
			>
				<For each={view().links}>{(d) => <path d={d} fill="none" stroke="currentColor" class="text-border" />}</For>
				<For each={local.nodes ?? []}>
					{(n) => {
						const p = view().pos.get(n.id);
						if (!p) return null;
						return (
							<g class={palette[(n.group ?? 0) % palette.length]}>
								<circle cx={p.x} cy={p.y} r="6" fill="currentColor" opacity="0.8">
									<title>{n.label ?? n.id}</title>
								</circle>
								{(n.label ?? n.id) && (
									<text x={p.x + 8} y={p.y + 3} font-size="8" class="fill-muted-foreground">
										{n.label ?? n.id}
									</text>
								)}
							</g>
						);
					}}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
