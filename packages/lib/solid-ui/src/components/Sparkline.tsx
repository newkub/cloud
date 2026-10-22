/**
 * Sparkline - tiny inline SVG trend line.
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

type SparklineVariant = "default" | "primary" | "success" | "warning" | "destructive" | "info";

const variantMap: Record<SparklineVariant, string> = {
	default: "text-primary",
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
};

export interface SparklineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SparklineVariant;
	data?: number[];
	label?: string;
	width?: number;
	height?: number;
	strokeWidth?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Sparkline(props: SparklineProps) {
	const merged = mergeProps({ width: 100, height: 20, strokeWidth: 2 }, props);
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"children",
		"data",
		"label",
		"width",
		"height",
		"strokeWidth",
		"radius",
		"elevation",
	]);

	const points = () => {
		const data = local.data ?? [];
		if (data.length === 0) return "";
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const stepX = data.length > 1 ? merged.width / (data.length - 1) : merged.width;
		return data
			.map((v, i) => `${(i * stepX).toFixed(2)},${(merged.height - ((v - min) / range) * merged.height).toFixed(2)}`)
			.join(" ");
	};

	const summary = () => {
		const data = local.data ?? [];
		if (data.length === 0) return local.label ?? "Sparkline chart";
		const min = Math.min(...data);
		const max = Math.max(...data);
		return `${local.label ?? "Sparkline"}: ${data.length} points, min ${min}, max ${max}, last ${data[data.length - 1]}`;
	};

	const className = () =>
		[
			"h-12 w-full",
			variantMap[local.variant ?? "default"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<svg
				class="h-full w-full"
				viewBox={`0 0 ${merged.width} ${merged.height}`}
				preserveAspectRatio="none"
				role="img"
				aria-label={summary()}
			>
				<polyline
					points={points()}
					fill="none"
					stroke="currentColor"
					stroke-width={merged.strokeWidth}
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	);
}
