/** Themed SVG renderer for the diagram model — all painting uses theme tokens. */
import { For, type JSX } from "solid-js";
import {
	type DiagramDirection,
	type DiagramEdge,
	type DiagramNode,
	type DiagramTone,
	layerLayout,
	type Placed,
} from "./model";

const toneShapeClass: Record<DiagramTone, string> = {
	default: "fill-surface stroke-border",
	primary: "fill-primary/10 stroke-primary/50",
	success: "fill-success/10 stroke-success/50",
	warning: "fill-warning/10 stroke-warning/50",
	destructive: "fill-destructive/10 stroke-destructive/50",
	info: "fill-info/10 stroke-info/50",
	muted: "fill-muted stroke-border",
};

const toneTextClass: Record<DiagramTone, string> = {
	default: "fill-foreground",
	primary: "fill-primary",
	success: "fill-success",
	warning: "fill-warning",
	destructive: "fill-destructive",
	info: "fill-info",
	muted: "fill-muted-foreground",
};

let markerSeq = 0;
function nextMarkerId() {
	return `su-diagram-arrow-${++markerSeq}`;
}

function nodeShape(n: Placed, shapeCls: string, textCls: string): JSX.Element {
	const cx = n.x + n.w / 2;
	const cy = n.y + n.h / 2;
	const shape = n.shape ?? "rounded";
	return (
		<g>
			{shape === "diamond" ? (
				<polygon
					points={`${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`}
					class={shapeCls}
					stroke-width="1.5"
				/>
			) : shape === "circle" ? (
				<ellipse cx={cx} cy={cy} rx={n.w / 2} ry={n.h / 2} class={shapeCls} stroke-width="1.5" />
			) : (
				<rect
					x={n.x}
					y={n.y}
					width={n.w}
					height={n.h}
					rx={shape === "pill" ? n.h / 2 : shape === "rounded" ? 8 : 2}
					class={shapeCls}
					stroke-width="1.5"
				/>
			)}
			<text x={cx} y={cy} dy="0.35em" text-anchor="middle" class={`${textCls} text-[11px]`} font-size="11">
				{n.label}
			</text>
		</g>
	);
}

function edgePath(a: Placed, b: Placed, direction: DiagramDirection): { d: string; mx: number; my: number } {
	const acx = a.x + a.w / 2;
	const acy = a.y + a.h / 2;
	const bcx = b.x + b.w / 2;
	const bcy = b.y + b.h / 2;
	let sx: number;
	let sy: number;
	let tx: number;
	let ty: number;
	if (direction === "tb") {
		const down = bcy >= acy;
		sx = acx;
		sy = down ? a.y + a.h : a.y;
		tx = bcx;
		ty = down ? b.y : b.y + b.h;
		const mid = (sy + ty) / 2;
		return { d: `M ${sx} ${sy} C ${sx} ${mid}, ${tx} ${mid}, ${tx} ${ty}`, mx: (sx + tx) / 2, my: mid };
	}
	const right = bcx >= acx;
	sx = right ? a.x + a.w : a.x;
	sy = acy;
	tx = right ? b.x : b.x + b.w;
	ty = bcy;
	const mid = (sx + tx) / 2;
	return { d: `M ${sx} ${sy} C ${mid} ${sy}, ${mid} ${ty}, ${tx} ${ty}`, mx: mid, my: (sy + ty) / 2 };
}

/** Render positioned nodes + edges as a themed SVG diagram. */
export function DiagramSvg(props: {
	nodes: DiagramNode[];
	edges: DiagramEdge[];
	direction?: DiagramDirection;
	class?: string;
	/** Accessible name prefix, e.g. "Flow diagram". @default "Diagram" */
	label?: string;
}) {
	const layout = () => layerLayout(props.nodes, props.edges, props.direction ?? "tb");
	const markerId = nextMarkerId();
	const byId = () => new Map(layout().placed.map((p) => [p.id, p]));
	const summary = () => {
		const names = props.nodes.map((n) => n.label).join(", ");
		return `${props.label ?? "Diagram"}: ${props.nodes.length} nodes${names ? ` (${names})` : ""}, ${props.edges.length} connections`;
	};
	return (
		<svg
			viewBox={`0 0 ${layout().width} ${layout().height}`}
			class={props.class ?? "h-auto w-full"}
			role="img"
			aria-label={summary()}
		>
			<defs>
				<marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
					<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
				</marker>
			</defs>
			<For each={props.edges}>
				{(e) => {
					const a = () => byId().get(e.from);
					const b = () => byId().get(e.to);
					const geo = () => (a() && b() ? edgePath(a() as Placed, b() as Placed, props.direction ?? "tb") : null);
					return (
						<>
							{geo() ? (
								<g>
									<path
										d={geo()?.d ?? ""}
										fill="none"
										class="stroke-muted-foreground"
										stroke-width="1.5"
										stroke-dasharray={e.dashed ? "5 4" : undefined}
										marker-end={`url(#${markerId})`}
									/>
									{e.label ? (
										<text
											x={geo()?.mx}
											y={(geo()?.my ?? 0) - 4}
											text-anchor="middle"
											class="fill-muted-foreground"
											font-size="10"
										>
											{e.label}
										</text>
									) : null}
								</g>
							) : null}
						</>
					);
				}}
			</For>
			<For each={layout().placed}>
				{(n) => nodeShape(n, toneShapeClass[n.tone ?? "default"], toneTextClass[n.tone ?? "default"])}
			</For>
		</svg>
	);
}
