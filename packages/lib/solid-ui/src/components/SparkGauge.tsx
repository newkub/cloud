/**
 * SparkGauge — tiny arc gauge with ok/warn/danger thresholds and a label slot.
 * @deprecated Use `RadialGauge` with `variant="arc"` and `zones`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { RadialGauge } from "./RadialGauge";

export interface SparkGaugeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current value @default 0 */
	value?: number;
	/** Scale minimum @default 0 */
	min?: number;
	/** Scale maximum @default 100 */
	max?: number;
	/** Zone edges as fractions 0..1 — [warn, danger] @default [0.7, 0.9] */
	thresholds?: [number, number];
	/** Caption under the dial */
	label?: string;
	/** Viewport width in px @default 96 */
	size?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SparkGauge(props: SparkGaugeProps) {
	const [local, rest] = splitProps(props, [
		"value",
		"min",
		"max",
		"thresholds",
		"label",
		"size",
		"radius",
		"elevation",
		"children",
	]);
	return (
		<RadialGauge
			variant="arc"
			value={local.value}
			min={local.min}
			max={local.max}
			zones={local.thresholds}
			label={local.label}
			size={local.size ?? 96}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		>
			{local.children}
		</RadialGauge>
	);
}
