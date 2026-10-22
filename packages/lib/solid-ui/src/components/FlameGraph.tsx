/**
 * FlameGraph — layered proportional bar rows visualizing a weighted call tree.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface FlameFrame {
	/** Frame label. */
	name: string;
	/** Frame weight — width is proportional to the root total. */
	value: number;
	/** Nested frames laid out on the next depth row. */
	children?: FlameFrame[];
}

export interface FlameGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root frames — sibling widths share the row proportionally. */
	frames?: FlameFrame[];
	/** Max depth rows rendered @default 8 */
	maxDepth?: number;
	/** Accessible label @default "Flame graph" */
	label?: string;
	variant?: SurfaceVariant;
	/** Row height @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

interface LaidFrame {
	frame: FlameFrame;
	/** Left offset as a % of the total. */
	left: number;
	/** Width as a % of the total. */
	width: number;
}

const rowHeight = { sm: "h-5", md: "h-6", lg: "h-7" } as const;
const depthTones = ["bg-primary/80", "bg-primary/60", "bg-info/70", "bg-success/70"] as const;

/** Lay out frames into depth rows; offsets/widths are % of the root total. */
function layout(frames: FlameFrame[], maxDepth: number): { rows: LaidFrame[][]; total: number } {
	const total = frames.reduce((sum, f) => sum + Math.max(0, f.value), 0);
	const rows: LaidFrame[][] = [];
	const walk = (list: FlameFrame[], depth: number, offset: number) => {
		if (depth >= maxDepth || total <= 0) return;
		let cursor = offset;
		for (const frame of list) {
			const value = Math.max(0, frame.value);
			const row = rows[depth] ?? [];
			if (!rows[depth]) rows[depth] = row;
			row.push({ frame, left: (cursor / total) * 100, width: (value / total) * 100 });
			walk(frame.children ?? [], depth + 1, cursor);
			cursor += value;
		}
	};
	walk(frames, 0, 0);
	return { rows, total };
}

export function FlameGraph(props: FlameGraphProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-flame-graph border p-3",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["frames", "maxDepth", "label", "children"]);
	const laid = () => layout(local.frames ?? [], local.maxDepth ?? 8);
	const pct = (value: number) => (laid().total > 0 ? ((value / laid().total) * 100).toFixed(1) : "0.0");
	return (
		<div class={className()} role="img" aria-label={local.label ?? "Flame graph"} {...dom}>
			<Show
				when={laid().rows.length > 0}
				fallback={<div class="py-4 text-center text-xs text-muted-foreground">No frames</div>}
			>
				<div class="space-y-0.5" aria-hidden="true">
					<For each={laid().rows}>
						{(row, depth) => (
							<div class={`relative ${rowHeight[props.size ?? "md"]}`}>
								<For each={row}>
									{(f) => (
										<div
											class={`absolute inset-y-0 flex min-w-px items-center overflow-hidden rounded-sm px-1 font-medium text-2xs text-primary-foreground transition-colors hover:bg-primary ${depthTones[depth() % depthTones.length]}`}
											style={{ left: `${f.left}%`, width: `${f.width}%` }}
											title={`${f.frame.name} — ${pct(f.frame.value)}% of total`}
										>
											<span class="block truncate">{f.frame.name}</span>
										</div>
									)}
								</For>
							</div>
						)}
					</For>
				</div>
			</Show>
			{local.children}
		</div>
	);
}
