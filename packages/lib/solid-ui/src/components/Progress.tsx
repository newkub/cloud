/**
 * Progress bar
 */
import { createMemo, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap, statusVariants } from "../lib/variants";

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: number;
	max?: number;
	indeterminate?: boolean;
	variant?: keyof typeof statusVariants;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Progress(props: ProgressProps) {
	const [local, rest] = splitProps(props, ["class", "value", "max", "indeterminate", "variant", "radius", "elevation"]);
	const merged = mergeProps({ max: 100, indeterminate: false }, local);

	const isIndeterminate = () =>
		merged.indeterminate || merged.value === undefined || merged.value === null || Number.isNaN(merged.value);

	const percent = createMemo(() => {
		if (isIndeterminate()) return 0;
		const v = Math.max(0, Math.min(merged.value as number, merged.max));
		return (v / merged.max) * 100;
	});

	const className = () =>
		[
			"h-2 w-full overflow-hidden bg-muted",
			radiusMap[local.radius ?? "full"],
			local.elevation ? elevationMap[local.elevation] : "",
			merged.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const fillClass = () => (merged.variant ? statusVariants[merged.variant] : "bg-primary");

	return (
		<div
			class={className()}
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={merged.max}
			aria-valuenow={isIndeterminate() ? undefined : (merged.value as number)}
			{...rest}
		>
			<Show
				when={!isIndeterminate()}
				fallback={<div class={`h-full w-full motion-safe:animate-pulse rounded-full ${fillClass()}`} />}
			>
				<div
					class={`h-full rounded-full transition-[width] motion-reduce:transition-none ${fillClass()}`}
					style={{ width: `${percent()}%` }}
				/>
			</Show>
		</div>
	);
}
