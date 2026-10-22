/**
 * FishboneDiagram — Ishikawa cause-effect: spine, rib categories and causes.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FishboneBone {
	label: string;
	causes?: string[];
}

export interface FishboneDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Effect label at the head of the fish. */
	effect?: string;
	bones?: FishboneBone[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function FishboneDiagram(props: FishboneDiagramProps) {
	const merged = mergeProps({ effect: "Effect", width: 480, height: 220 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"effect",
		"bones",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const bones = local.bones ?? [];
		const midY = local.height / 2;
		const headX = local.width - 70;
		const n = Math.max(1, bones.length);
		const ribs = bones.map((b, i) => {
			const top = i % 2 === 0;
			const order = Math.floor(i / 2);
			const perSide = Math.ceil(n / 2);
			const x0 = 30 + (order / Math.max(1, perSide)) * (headX - 60);
			const x1 = x0 + 50;
			const y1 = top ? midY - 70 : midY + 70;
			const causes = (b.causes ?? []).map((c, ci) => ({
				label: c,
				x0: x0 + 14 + ci * 22,
				x1: x0 + 14 + ci * 22 + 16,
				y1: top ? midY - 34 - ci * 18 : midY + 34 + ci * 18,
			}));
			return { label: b.label, x0, x1, y1, top, causes, spineY: midY };
		});
		return { ribs, midY, headX };
	};

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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Fishbone diagram">
				<line
					x1={20}
					x2={view().headX}
					y1={view().midY}
					y2={view().midY}
					stroke="currentColor"
					stroke-width="2"
					class="text-foreground"
				/>
				<rect
					x={view().headX}
					y={view().midY - 16}
					width="64"
					height="32"
					rx="6"
					fill="currentColor"
					class="text-primary"
				/>
				<text
					x={view().headX + 32}
					y={view().midY + 3}
					text-anchor="middle"
					font-size="9"
					class="fill-primary-foreground font-semibold"
				>
					{local.effect}
				</text>
				<For each={view().ribs}>
					{(r) => (
						<g>
							<line x1={r.x0} y1={r.spineY} x2={r.x1} y2={r.y1} stroke="currentColor" class="text-muted-foreground" />
							<text x={r.x1 + 2} y={r.y1 + (r.top ? -4 : 10)} font-size="8" class="fill-foreground font-medium">
								{r.label}
							</text>
							<For each={r.causes}>
								{(c) => (
									<g>
										<line x1={c.x0} y1={r.spineY} x2={c.x1} y2={c.y1} stroke="currentColor" class="text-border" />
										<text x={c.x1 + 2} y={c.y1 + (r.top ? -2 : 8)} font-size="7" class="fill-muted-foreground">
											{c.label}
										</text>
									</g>
								)}
							</For>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
