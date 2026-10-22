/**
 * RadialGauge — dial arc with needle and low/ok/high zones.
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RadialGaugeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: number;
	min?: number;
	max?: number;
	label?: string;
	/** "dial" = 240° gauge with needle; "arc" = compact half-arc with threshold-colored fill @default "dial" */
	variant?: "dial" | "arc";
	/** Zone edges as fractions 0..1 — [warn, danger]. @default [0.7, 0.9] */
	zones?: [number, number];
	size?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
	const a = ((deg - 90) * Math.PI) / 180;
	return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) =>
	`M${polar(cx, cy, r, a0)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${polar(cx, cy, r, a1)}`;

export function RadialGauge(props: RadialGaugeProps) {
	const merged = mergeProps({ value: 0, min: 0, max: 100, zones: [0.7, 0.9] as [number, number], size: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"value",
		"min",
		"max",
		"label",
		"variant",
		"zones",
		"size",
		"radius",
		"elevation",
	]);

	const c = () => local.size / 2;
	const r = () => c() - 14;
	const span = 240; // degrees: -120..120
	const frac = () => Math.min(1, Math.max(0, (local.value - local.min) / (local.max - local.min || 1)));
	const ang = (f: number) => -120 + f * span;

	if (local.variant === "arc") {
		const halfPt = (f: number) => {
			const a = Math.PI * (1 + f);
			return `${(c() + r() * Math.cos(a)).toFixed(1)},${(c() + 6 + r() * Math.sin(a)).toFixed(1)}`;
		};
		const halfArc = (f0: number, f1: number) =>
			`M${halfPt(f0)} A${r()},${r()} 0 ${f1 - f0 > 0.5 ? 1 : 0} 1 ${halfPt(f1)}`;
		const tone = () =>
			frac() >= local.zones[1] ? "text-destructive" : frac() >= local.zones[0] ? "text-warning" : "text-success";
		return (
			<div
				class={[
					"inline-flex flex-col items-center gap-1",
					local.radius ? radiusMap[local.radius] : "",
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ")}
				{...rest}
			>
				<svg
					width={local.size}
					height={local.size / 2 + 10}
					viewBox={`0 0 ${local.size} ${local.size / 2 + 10}`}
					role="img"
					aria-label={`${local.label ?? "Gauge"}: ${local.value} of ${local.max}`}
				>
					<path
						d={halfArc(0, 1)}
						fill="none"
						stroke="currentColor"
						stroke-width="8"
						class="text-muted"
						stroke-linecap="round"
					/>
					{frac() > 0 ? (
						<path
							d={halfArc(0, Math.max(0.02, frac()))}
							fill="none"
							stroke="currentColor"
							stroke-width="8"
							class={tone()}
							stroke-linecap="round"
						/>
					) : null}
					<text
						x={c()}
						y={c() + 4}
						text-anchor="middle"
						font-size="13"
						class="fill-foreground font-semibold tabular-nums"
					>
						{local.value}
					</text>
				</svg>
				{local.label && <span class="text-2xs text-muted-foreground">{local.label}</span>}
				{local.children}
			</div>
		);
	}

	return (
		<div
			class={[
				"inline-flex flex-col items-center gap-1",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				width={local.size}
				height={local.size * 0.75}
				viewBox={`0 0 ${local.size} ${local.size}`}
				role="img"
				aria-label={`${local.label ?? "Gauge"}: ${local.value}`}
			>
				<path
					d={arc(c(), c(), r(), -120, 120)}
					fill="none"
					stroke="currentColor"
					stroke-width="10"
					class="text-muted"
					stroke-linecap="round"
				/>
				<path
					d={arc(c(), c(), r(), ang(local.zones[0]), 120)}
					fill="none"
					stroke="currentColor"
					stroke-width="10"
					class="text-destructive/50"
				/>
				<path
					d={arc(c(), c(), r(), -120, ang(frac()))}
					fill="none"
					stroke="currentColor"
					stroke-width="10"
					class="text-primary"
					stroke-linecap="round"
				/>
				<line
					x1={c()}
					y1={c()}
					x2={Number(polar(c(), c(), r() - 12, ang(frac())).split(",")[0])}
					y2={Number(polar(c(), c(), r() - 12, ang(frac())).split(",")[1])}
					stroke="currentColor"
					stroke-width="2.5"
					class="text-foreground"
					stroke-linecap="round"
				/>
				<circle cx={c()} cy={c()} r="4" fill="currentColor" class="text-foreground" />
				<text
					x={c()}
					y={c() + 24}
					text-anchor="middle"
					font-size="14"
					class="fill-foreground font-semibold tabular-nums"
				>
					{local.value}
				</text>
			</svg>
			{local.label && <span class="text-2xs text-muted-foreground">{local.label}</span>}
			{local.children}
		</div>
	);
}
