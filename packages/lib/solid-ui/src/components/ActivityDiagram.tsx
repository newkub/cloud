/**
 * ActivityDiagram — UML activity flow: start/end circles, rounded actions, diamond decisions.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type ActivityStep =
	| { kind: "start" | "end"; label?: string }
	| { kind: "action"; label: string }
	| { kind: "decision"; label: string };

export interface ActivityDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps?: ActivityStep[];
	width?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ActivityDiagram(props: ActivityDiagramProps) {
	const merged = mergeProps({ width: 240 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "steps", "width", "radius", "elevation"]);

	const rows = () => {
		const steps = local.steps ?? [];
		const rowH = 48;
		return {
			height: steps.length * rowH + 16,
			rows: steps.map((s, i) => ({ ...s, y: 16 + i * rowH + 20, cy: 16 + i * rowH })),
		};
	};

	const cx = () => local.width / 2;

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
			<svg class="mx-auto" viewBox={`0 0 ${local.width} ${rows().height}`} role="img" aria-label="Activity diagram">
				<For each={rows().rows.slice(1)}>
					{(r, i) => (
						<path
							d={`M${cx()},${rows().rows[i()].cy + 14} L${cx()},${r.cy - 10}`}
							fill="none"
							stroke="currentColor"
							class="text-border"
							marker-end="url(#ad-arrow)"
						/>
					)}
				</For>
				<defs>
					<marker id="ad-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="currentColor" class="text-muted-foreground" />
					</marker>
				</defs>
				<For each={rows().rows}>
					{(r) => (
						<g>
							{r.kind === "start" && (
								<circle cx={cx()} cy={r.y - 8} r="7" fill="currentColor" class="text-foreground" />
							)}
							{r.kind === "end" && (
								<g>
									<circle
										cx={cx()}
										cy={r.y - 8}
										r="8"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										class="text-foreground"
									/>
									<circle cx={cx()} cy={r.y - 8} r="4" fill="currentColor" class="text-foreground" />
								</g>
							)}
							{r.kind === "action" && (
								<g>
									<rect
										x={cx() - 52}
										y={r.y - 18}
										width="104"
										height="20"
										rx="10"
										fill="var(--color-surface)"
										stroke="currentColor"
										class="text-primary"
									/>
									<text x={cx()} y={r.y - 5} text-anchor="middle" font-size="9" class="fill-foreground">
										{r.label}
									</text>
								</g>
							)}
							{r.kind === "decision" && (
								<g>
									<path
										d={`M${cx()},${r.y - 22} L${cx() + 46},${r.y - 8} L${cx()},${r.y + 6} L${cx() - 46},${r.y - 8} Z`}
										fill="var(--color-surface)"
										stroke="currentColor"
										class="text-warning"
									/>
									<text x={cx()} y={r.y - 5} text-anchor="middle" font-size="8" class="fill-foreground">
										{r.label}
									</text>
								</g>
							)}
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
