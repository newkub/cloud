/**
 * AdjacencyMatrix — graph links as a filled-cell matrix.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AdjacencyMatrixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	nodes?: string[];
	/** [from, to, weight?] link triples. */
	links?: [number, number, number?][];
	/** Cell size in px. @default 18 */
	cell?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function AdjacencyMatrix(props: AdjacencyMatrixProps) {
	const merged = mergeProps({ cell: 18 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "nodes", "links", "cell", "radius", "elevation"]);

	const cells = () => {
		const n = (local.nodes ?? []).length;
		const max = Math.max(1, ...(local.links ?? []).map((l) => l[2] ?? 1));
		const map = new Map<string, number>();
		for (const [s, t, w] of local.links ?? []) map.set(`${s},${t}`, w ?? 1);
		return Array.from({ length: n * n }, (_, i) => {
			const r = Math.floor(i / n);
			const c = i % n;
			const v = map.get(`${r},${c}`) ?? 0;
			return { r, c, v, op: v ? 0.25 + (v / max) * 0.75 : 0 };
		});
	};

	const size = () => (local.nodes ?? []).length * local.cell + 60;

	return (
		<div
			class={[
				"w-full overflow-x-auto",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg width={size()} height={size()} viewBox={`0 0 ${size()} ${size()}`} role="img" aria-label="Adjacency matrix">
				<For each={local.nodes ?? []}>
					{(n, i) => (
						<>
							<text
								x={58}
								y={56 + i() * local.cell + local.cell / 2 + 3}
								text-anchor="end"
								font-size="8"
								class="fill-muted-foreground"
							>
								{n}
							</text>
							<text
								x={58 + i() * local.cell + local.cell / 2}
								y={52}
								text-anchor="middle"
								font-size="8"
								class="fill-muted-foreground"
							>
								{n}
							</text>
						</>
					)}
				</For>
				<For each={cells()}>
					{(c) => (
						<rect
							x={58 + c.c * local.cell}
							y={56 + c.r * local.cell}
							width={local.cell - 1}
							height={local.cell - 1}
							rx="2"
							fill="currentColor"
							class={c.v ? "text-primary" : "text-muted"}
							opacity={c.v ? c.op : 0.5}
						/>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
