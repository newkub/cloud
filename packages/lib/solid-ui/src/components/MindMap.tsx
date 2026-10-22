/**
 * MindMap — radial mind map. Root sits at the center, branches fan out.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import type { TreeNode } from "./TreeDiagram";

export interface MindMapProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root topic — children radiate outward */
	root?: TreeNode;
	/** Canvas density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;
const PALETTE = ["primary", "success", "warning", "info", "destructive"] as const;
const toneShape: Record<(typeof PALETTE)[number], string> = {
	primary: "fill-primary/10 stroke-primary/50",
	success: "fill-success/10 stroke-success/50",
	warning: "fill-warning/10 stroke-warning/50",
	info: "fill-info/10 stroke-info/50",
	destructive: "fill-destructive/10 stroke-destructive/50",
};

export function MindMap(props: MindMapProps) {
	const [local, rest] = splitProps(props, ["class", "root", "size", "radius", "elevation"]);
	const W = 560;
	const H = 360;
	const cx = W / 2;
	const cy = H / 2;
	const R = 130;

	const branches = () => local.root?.children ?? [];
	const angleFor = (i: number) => (i / Math.max(branches().length, 1)) * Math.PI * 2 - Math.PI / 2;
	const pos = (i: number) => ({ x: cx + R * Math.cos(angleFor(i)), y: cy + R * Math.sin(angleFor(i)) });

	return (
		<div
			class={`solidui-mind-map ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox={`0 0 ${W} ${H}`}
				class="h-auto w-full"
				role="img"
				aria-label={`Mind map: ${local.root?.label} — ${branches()
					.map((b) => b.label)
					.join(", ")}`}
			>
				<For each={branches()}>
					{(branch, i) => {
						const p = () => pos(i());
						const tone = () => toneShape[PALETTE[i() % PALETTE.length]];
						const bw = () => Math.max(88, branch.label.length * 7 + 28);
						return (
							<g>
								<path
									d={`M ${cx} ${cy} Q ${(cx + p().x) / 2} ${(cy + p().y) / 2 - 18}, ${p().x} ${p().y}`}
									fill="none"
									class="stroke-muted-foreground"
									stroke-width="1.5"
								/>
								<rect
									x={p().x - bw() / 2}
									y={p().y - 16}
									width={bw()}
									height={32}
									rx={16}
									class={tone()}
									stroke-width="1.5"
								/>
								<text x={p().x} y={p().y} dy="0.35em" text-anchor="middle" class="fill-foreground" font-size="11">
									{branch.label}
								</text>
							</g>
						);
					}}
				</For>
				<rect
					x={cx - Math.max(60, local.root?.label?.length ?? 0 * 4 + 20)}
					y={cy - 22}
					width={Math.max(120, local.root?.label?.length ?? 0 * 8 + 40)}
					height={44}
					rx={22}
					class="fill-primary stroke-primary"
				/>
				<text
					x={cx}
					y={cy}
					dy="0.35em"
					text-anchor="middle"
					class="fill-primary-foreground"
					font-size="12"
					font-weight="600"
				>
					{local.root?.label}
				</text>
			</svg>
		</div>
	);
}
