/**
 * ComponentDiagram — UML component boxes with interface lollipops/sockets and dashed links.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface UmlComponent {
	name: string;
	/** Provided interfaces — drawn as lollipops. */
	provides?: string[];
	/** Required interfaces — drawn as sockets. */
	requires?: string[];
}

export interface ComponentDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	components?: UmlComponent[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ComponentDiagram(props: ComponentDiagramProps) {
	const merged = mergeProps({ width: 420, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"components",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const comps = local.components ?? [];
		const n = Math.max(1, comps.length);
		const bw = 120;
		const bh = 64;
		return comps.map((c, i) => ({
			...c,
			x: 16 + (i % Math.ceil(Math.sqrt(n))) * (local.width - bw - 20),
			y: 16 + Math.floor(i / Math.ceil(Math.sqrt(n))) * (local.height - bh - 20),
			bw,
			bh,
		}));
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Component diagram">
				<For each={view()}>
					{(c) => (
						<g>
							<rect
								x={c.x}
								y={c.y}
								width={c.bw}
								height={c.bh}
								rx="6"
								fill="var(--color-surface)"
								stroke="currentColor"
								class="text-primary"
							/>
							{/* component glyph */}
							<rect
								x={c.x + 5}
								y={c.y + 6}
								width="12"
								height="16"
								fill="none"
								stroke="currentColor"
								class="text-primary"
							/>
							<line x1={c.x + 7} y1={c.y + 10} x2={c.x + 15} y2={c.y + 10} stroke="currentColor" class="text-primary" />
							<line x1={c.x + 7} y1={c.y + 14} x2={c.x + 15} y2={c.y + 14} stroke="currentColor" class="text-primary" />
							<text x={c.x + 22} y={c.y + 18} font-size="10" class="fill-foreground font-semibold">
								{c.name}
							</text>
							<For each={c.provides ?? []}>
								{(p, i) => (
									<g>
										<circle
											cx={c.x + c.bw}
											cy={c.y + 18 + i() * 16}
											r="4"
											fill="none"
											stroke="currentColor"
											class="text-success"
										/>
										<line
											x1={c.x + c.bw - 8}
											y1={c.y + 18 + i() * 16}
											x2={c.x + c.bw - 4}
											y2={c.y + 18 + i() * 16}
											stroke="currentColor"
											class="text-success"
										/>
										<text x={c.x + c.bw + 8} y={c.y + 21 + i() * 16} font-size="7" class="fill-muted-foreground">
											{p}
										</text>
									</g>
								)}
							</For>
							<For each={c.requires ?? []}>
								{(r, i) => (
									<g>
										<path
											d={`M${c.x - 8},${c.y + 18 + i() * 16} a5,5 0 0 1 8,0`}
											fill="none"
											stroke="currentColor"
											class="text-warning"
										/>
										<text
											x={c.x - 10}
											y={c.y + 28 + i() * 16}
											text-anchor="end"
											font-size="7"
											class="fill-muted-foreground"
										>
											{r}
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
