/**
 * MetricTile — compact metric strip: label, big value, delta arrow and an
 * inline sparkline. Denser sibling of MetricCard.
 * @deprecated Use `Stat` with `delta` + `spark`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Radius } from "../lib/variants";
import { Stat } from "./Stat";

export interface MetricTileProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Metric name */
	label: string;
	/** Metric value */
	value: string | number;
	/** Signed delta, e.g. 4.2 → "+4.2%" */
	delta?: number;
	/** Delta suffix. @default "%" */
	deltaSuffix?: string;
	/** Sparkline samples - oldest first. */
	spark?: number[];
	/** Corner radius. */
	radius?: Radius;
}

export function MetricTile(props: MetricTileProps) {
	const [local, rest] = splitProps(props, ["label", "value", "delta", "deltaSuffix", "spark", "radius"]);
	return (
		<Stat
			label={local.label}
			value={local.value}
			delta={local.delta}
			deltaSuffix={local.deltaSuffix}
			spark={local.spark}
			radius={local.radius}
			{...rest}
		/>
	);
}
