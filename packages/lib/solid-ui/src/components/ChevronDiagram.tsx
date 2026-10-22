/**
 * ChevronDiagram — process steps as interlocking chevron arrows.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ChevronDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	steps?: { label: string; hint?: string }[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ChevronDiagram(props: ChevronDiagramProps) {
	const merged = mergeProps({ width: 460, height: 56 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "steps", "width", "height", "radius", "elevation"]);

	const chevrons = () => {
		const steps = local.steps ?? [];
		const n = Math.max(1, steps.length);
		const tip = 14;
		const w = (local.width - tip) / n;
		return steps.map((s, i) => {
			const x = i * w;
			const notch = i === 0 ? 0 : tip;
			return {
				label: s.label,
				d: `M${x},4 L${x + w},4 L${x + w + tip},${local.height / 2} L${x + w},${local.height - 4} L${x},${local.height - 4} L${x + notch},${local.height / 2} Z`,
				tx: x + notch / 2 + w / 2,
			};
		});
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Chevron diagram">
				<For each={chevrons()}>
					{(c, i) => (
						<g>
							<path
								d={c.d}
								fill="currentColor"
								class={i() === chevrons().length - 1 ? "text-primary" : "text-primary/60"}
								opacity={0.55 + i() * 0.1}
							/>
							<text
								x={c.tx}
								y={local.height / 2 + 3}
								text-anchor="middle"
								font-size="9"
								class="fill-primary-foreground font-medium"
							>
								{c.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
