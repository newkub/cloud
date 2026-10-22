/**
 * ChordDiagram — ring of arcs with ribbons showing flows between nodes.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ChordDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	labels?: string[];
	/** N×N flow matrix — matrix[i][j] = flow from i to j. */
	matrix?: number[][];
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

const polar = (c: number, r: number, a: number) =>
	`${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`;

export function ChordDiagram(props: ChordDiagramProps) {
	const merged = mergeProps({ size: 220 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "labels", "matrix", "size", "radius", "elevation"]);

	const view = () => {
		const m = local.matrix ?? [];
		const n = m.length;
		if (!n) return { arcs: [], chords: [] };
		const c = local.size / 2;
		const r = c - 30;
		const totals = m.map((row) => row.reduce((a, v) => a + v, 0));
		const grand = Math.max(
			1e-9,
			totals.reduce((a, v) => a + v, 0),
		);
		const gap = 0.04;
		const span = (Math.PI * 2 - gap * n) / grand;
		const arcs: { d: string; cls: string; label: string }[] = [];
		const chords: { d: string; cls: string }[] = [];
		let a = -Math.PI / 2;
		const subStart: number[][] = m.map(() => []);
		for (let i = 0; i < n; i++) {
			const a0 = a;
			let cursor = a;
			for (let j = 0; j < n; j++) {
				subStart[i][j] = cursor;
				cursor += Math.max(0, m[i][j]) * span;
			}
			const a1 = a0 + totals[i] * span;
			arcs.push({
				d: `M${polar(c, r, a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${polar(c, r, a1)} L${polar(c, r - 12, a1)} A${r - 12},${r - 12} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${polar(c, r - 12, a0)} Z`,
				cls: palette[i % palette.length],
				label: `${local.labels?.[i] ?? `Node ${i + 1}`}: ${totals[i]}`,
			});
			a = cursor + gap;
		}
		for (let i = 0; i < n; i++)
			for (let j = i + 1; j < n; j++) {
				const v = m[i][j] + m[j][i];
				if (!v) continue;
				const p1 = polar(c, r - 12, subStart[i][j]);
				const p2 = polar(c, r - 12, subStart[j][i]);
				chords.push({
					d: `M${p1} Q${c},${c} ${p2} Q${c},${c} ${p1} Z`,
					cls: palette[i % palette.length],
				});
			}
		return { arcs, chords };
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
				aria-label="Chord diagram"
			>
				<For each={view().chords}>{(ch) => <path d={ch.d} fill="currentColor" class={ch.cls} opacity="0.35" />}</For>
				<For each={view().arcs}>
					{(arc) => (
						<path d={arc.d} fill="currentColor" class={arc.cls}>
							<title>{arc.label}</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
