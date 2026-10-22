/**
 * EventTimeline — point events on a shared time axis, grouped into labeled lanes.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TimelineEvent {
	/** Lane index. */
	lane: number;
	/** Position 0..1 along the axis (or ms timestamp when `domain` is set). */
	at: number;
	label?: string;
	/** Marks important events. */
	major?: boolean;
}

export interface EventTimelineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lanes?: string[];
	events?: TimelineEvent[];
	/** [start,end] — when set, `at` values are interpreted in this domain. */
	domain?: [number, number];
	width?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function EventTimeline(props: EventTimelineProps) {
	const merged = mergeProps({ width: 420 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"lanes",
		"events",
		"domain",
		"width",
		"radius",
		"elevation",
	]);

	const lanes = () => local.lanes ?? ["Events"];
	const frac = (at: number) => {
		const d = local.domain;
		return d ? (at - d[0]) / (d[1] - d[0] || 1) : at;
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
				class="w-full"
				viewBox={`0 0 ${local.width} ${lanes().length * 26 + 14}`}
				role="img"
				aria-label="Event timeline"
			>
				<For each={lanes()}>
					{(lane, i) => (
						<g>
							<text x={4} y={i() * 26 + 18} font-size="9" class="fill-muted-foreground">
								{lane}
							</text>
							<line
								x1={64}
								x2={local.width - 8}
								y1={i() * 26 + 14}
								y2={i() * 26 + 14}
								stroke="currentColor"
								class="text-border"
							/>
						</g>
					)}
				</For>
				<For each={local.events ?? []}>
					{(e) => {
						const x = 64 + Math.min(1, Math.max(0, frac(e.at))) * (local.width - 72);
						const y = (e.lane ?? 0) * 26 + 14;
						return (
							<g class={e.major ? "text-warning" : "text-primary"}>
								{e.major ? (
									<rect
										x={x - 4}
										y={y - 4}
										width="8"
										height="8"
										rx="1.5"
										fill="currentColor"
										transform={`rotate(45 ${x} ${y})`}
									>
										{e.label && <title>{e.label}</title>}
									</rect>
								) : (
									<circle cx={x} cy={y} r="3.5" fill="currentColor">
										{e.label && <title>{e.label}</title>}
									</circle>
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
