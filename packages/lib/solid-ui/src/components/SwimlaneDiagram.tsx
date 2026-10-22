/**
 * SwimlaneDiagram — horizontal lanes with tasks positioned along a shared axis.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SwimlaneTask {
	lane: number;
	/** Start/end as 0..1 fractions of the axis. */
	from: number;
	to: number;
	label: string;
	done?: boolean;
}

export interface SwimlaneDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lanes?: string[];
	tasks?: SwimlaneTask[];
	width?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function SwimlaneDiagram(props: SwimlaneDiagramProps) {
	const merged = mergeProps({ width: 420 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "lanes", "tasks", "width", "radius", "elevation"]);

	const lanes = () => local.lanes ?? ["Lane 1"];
	const laneH = 36;
	const labelW = 72;
	const barX = (f: number) => labelW + f * (local.width - labelW - 12);

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
			<svg
				class="w-full"
				viewBox={`0 0 ${local.width} ${lanes().length * laneH + 12}`}
				role="img"
				aria-label="Swimlane diagram"
			>
				<For each={lanes()}>
					{(lane, i) => (
						<g>
							<rect
								x={4}
								y={i() * laneH + 6}
								width={local.width - 8}
								height={laneH - 4}
								rx="6"
								fill="currentColor"
								class={i() % 2 ? "text-muted/30" : "text-muted/60"}
								opacity="0.4"
							/>
							<text x={10} y={i() * laneH + 24} font-size="9" class="fill-muted-foreground font-medium">
								{lane}
							</text>
						</g>
					)}
				</For>
				<For each={local.tasks ?? []}>
					{(t) => {
						const x0 = barX(t.from);
						const x1 = barX(t.to);
						const y = t.lane * laneH + 12;
						return (
							<g>
								<rect
									x={x0}
									y={y}
									width={Math.max(8, x1 - x0)}
									height={laneH - 16}
									rx="4"
									fill="currentColor"
									class={t.done ? "text-muted-foreground" : "text-primary"}
									opacity="0.85"
								>
									<title>{t.label}</title>
								</rect>
								{x1 - x0 > 40 && (
									<text x={x0 + 6} y={y + 13} font-size="8" class="fill-primary-foreground">
										{t.label}
									</text>
								)}
							</g>
						);
					}}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
