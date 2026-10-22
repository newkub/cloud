/**
 * SVG circular progress indicator
 */
import { createMemo, type JSX, mergeProps, splitProps } from "solid-js";
import type { statusVariants } from "../lib/variants";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const strokeVariants: Record<keyof typeof statusVariants, string> = {
	default: "text-primary",
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
};

export interface ProgressCircleProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, "stroke"> {
	value?: number;
	max?: number;
	size?: number;
	stroke?: number;
	variant?: keyof typeof statusVariants;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ProgressCircle(props: ProgressCircleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"max",
		"size",
		"stroke",
		"children",
		"variant",
		"radius",
		"elevation",
	]);
	const merged = mergeProps({ value: 0, max: 100, size: 48, stroke: 4 }, local);

	const radius = () => (merged.size - merged.stroke) / 2;
	const center = () => merged.size / 2;
	const circumference = () => 2 * Math.PI * radius();
	const percent = createMemo(() => Math.max(0, Math.min((merged.value / merged.max) * 100, 100)));
	const dashOffset = () => circumference() - (percent() / 100) * circumference();

	const className = () =>
		[
			"inline-block",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<svg
			{...rest}
			class={className()}
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={merged.max}
			aria-valuenow={merged.value}
			width={merged.size}
			height={merged.size}
			viewBox={`0 0 ${merged.size} ${merged.size}`}
			fill="none"
		>
			<circle
				cx={center()}
				cy={center()}
				r={radius()}
				class="text-muted"
				stroke="currentColor"
				stroke-width={merged.stroke}
				stroke-linecap="round"
				fill="none"
			/>
			<circle
				cx={center()}
				cy={center()}
				r={radius()}
				class={strokeVariants[local.variant ?? "default"]}
				stroke="currentColor"
				stroke-width={merged.stroke}
				stroke-linecap="round"
				stroke-dasharray={String(circumference())}
				stroke-dashoffset={dashOffset()}
				transform={`rotate(-90 ${center()} ${center()})`}
				fill="none"
			/>
		</svg>
	);
}
