/**
 * IcicleChart — top-down partition rectangles for hierarchical data.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface IcicleNode {
	label: string;
	value?: number;
	children?: IcicleNode[];
}

export interface IcicleChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: IcicleNode[];
	width?: number;
	/** Row height per level. @default 28 */
	rowHeight?: number;
	/** Max depth. @default 4 */
	depth?: number;
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
const nodeTotal = (n: IcicleNode): number => n.value ?? (n.children ?? []).reduce((a, ch) => a + nodeTotal(ch), 0);

export function IcicleChart(props: IcicleChartProps) {
	const merged = mergeProps({ width: 400, rowHeight: 28, depth: 4 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"width",
		"rowHeight",
		"depth",
		"radius",
		"elevation",
	]);

	const rects = () => {
		const out: { x: number; y: number; w: number; label: string; cls: string }[] = [];
		const walk = (nodes: IcicleNode[], depth: number, x0: number, w: number, hue: number) => {
			if (depth >= local.depth) return;
			const total = Math.max(
				1e-9,
				nodes.reduce((a, n) => a + nodeTotal(n), 0),
			);
			let x = x0;
			for (const n of nodes) {
				const nw = (w * nodeTotal(n)) / total;
				out.push({
					x,
					y: depth * local.rowHeight,
					w: Math.max(0, nw - 1),
					label: `${n.label}: ${nodeTotal(n)}`,
					cls: palette[(hue + depth) % palette.length],
				});
				if (n.children) walk(n.children, depth + 1, x, nw, hue + 1);
				x += nw;
			}
		};
		walk(local.data ?? [], 0, 0, local.width, 0);
		return out;
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
				class="w-full"
				viewBox={`0 0 ${local.width} ${local.depth * local.rowHeight}`}
				role="img"
				aria-label="Icicle chart"
			>
				<For each={rects()}>
					{(r) => (
						<rect
							x={r.x}
							y={r.y}
							width={r.w}
							height={local.rowHeight - 2}
							rx="2"
							fill="currentColor"
							class={r.cls}
							opacity="0.75"
						>
							<title>{r.label}</title>
						</rect>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
