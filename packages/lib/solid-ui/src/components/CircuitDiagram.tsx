/**
 * CircuitDiagram — schematic symbols on a wire grid: resistor, capacitor, diode, ground, vcc.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type CircuitSymbol = "resistor" | "capacitor" | "diode" | "ground" | "vcc" | "node";

export interface CircuitPart {
	kind: CircuitSymbol;
	/** Grid position 0..1. */
	x: number;
	y: number;
	label?: string;
}

export interface CircuitDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	parts?: CircuitPart[];
	/** Wire segments [x1,y1,x2,y2] in 0..1 coords. */
	wires?: [number, number, number, number][];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function CircuitDiagram(props: CircuitDiagramProps) {
	const merged = mergeProps({ width: 360, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"parts",
		"wires",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const px = (f: number) => f * local.width;
	const py = (f: number) => f * local.height;

	const symbol = (p: CircuitPart) => {
		const x = px(p.x);
		const y = py(p.y);
		switch (p.kind) {
			case "resistor":
				return `M${x - 16},${y} h4 l3,-6 6,12 6,-12 6,12 3,-6 h4`;
			case "capacitor":
				return `M${x - 10},${y} h8 M${x + 2},${y} h8 M${x - 2},${y - 6} v12 M${x + 2},${y - 6} v12`;
			case "diode":
				return `M${x - 10},${y} h6 M${x - 4},${y - 6} l0,12 10,-6 Z M${x + 6},${y - 6} v12 M${x + 6},${y} h6`;
			case "ground":
				return `M${x},${y - 8} v8 M${x - 10},${y} h20 M${x - 6},${y + 4} h12 M${x - 2},${y + 8} h4`;
			case "vcc":
				return `M${x},${y + 6} v-8 M${x - 5},${y - 6} h10`;
			case "node":
				return "";
		}
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Circuit diagram">
				<For each={local.wires ?? []}>
					{([x1, y1, x2, y2]) => (
						<line
							x1={px(x1)}
							y1={py(y1)}
							x2={px(x2)}
							y2={py(y2)}
							stroke="currentColor"
							stroke-width="1.5"
							class="text-foreground"
						/>
					)}
				</For>
				<For each={local.parts ?? []}>
					{(p) => (
						<g>
							{p.kind === "node" ? (
								<circle cx={px(p.x)} cy={py(p.y)} r="3" fill="currentColor" class="text-foreground" />
							) : (
								<path
									d={symbol(p)}
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linejoin="round"
									class="text-foreground"
								/>
							)}
							{p.label && (
								<text x={px(p.x) + 14} y={py(p.y) - 6} font-size="8" class="fill-muted-foreground">
									{p.label}
								</text>
							)}
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
