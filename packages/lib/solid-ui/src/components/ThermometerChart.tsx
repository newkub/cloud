/**
 * ThermometerChart — vertical fill meter toward a goal (fundraising, quota burn-up).
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ThermometerChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: number;
	max?: number;
	label?: string;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ThermometerChart(props: ThermometerChartProps) {
	const merged = mergeProps({ value: 0, max: 100, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"value",
		"max",
		"label",
		"height",
		"radius",
		"elevation",
	]);

	const frac = () => Math.min(1, Math.max(0, local.value / (local.max || 1)));
	const fillH = () => frac() * (local.height - 24);

	return (
		<div
			class={[
				"inline-flex flex-col items-center gap-2 text-primary",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			role="img"
			aria-label={`${local.label ?? "Progress"}: ${local.value} of ${local.max}`}
			{...rest}
		>
			<svg width="36" height={local.height} viewBox={`0 0 36 ${local.height}`} aria-hidden="true">
				<rect
					x="12"
					y="4"
					width="12"
					height={local.height - 24}
					rx="6"
					fill="none"
					stroke="currentColor"
					class="text-border"
				/>
				<rect x="14" y={4 + (local.height - 24) - fillH()} width="8" height={fillH()} rx="4" fill="currentColor" />
				<circle cx="18" cy={local.height - 12} r="10" fill="currentColor" />
				<circle cx="18" cy={local.height - 12} r="10" fill="none" stroke="currentColor" class="text-border" />
			</svg>
			<span class="font-mono text-xs font-semibold tabular-nums text-foreground">{Math.round(frac() * 100)}%</span>
			{local.label && <span class="text-2xs text-muted-foreground">{local.label}</span>}
			{local.children}
		</div>
	);
}
