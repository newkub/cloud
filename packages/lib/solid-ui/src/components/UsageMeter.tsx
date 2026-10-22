/**
 * UsageMeter — labeled quota bar with used/limit values, percentage and a warning threshold.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface UsageMeterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Meter label (also the aria-label). */
	label: string;
	/** Amount consumed. */
	used: number;
	/** Quota limit. */
	limit: number;
	/** Fraction (0–1) at which the bar turns warning. @default 0.8 */
	warnAt?: number;
	/** Unit suffix shown next to the values, e.g. "GB". */
	unit?: string;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const barHeight = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function UsageMeter(props: UsageMeterProps) {
	const [local, rest] = splitProps(props, ["class", "label", "used", "limit", "warnAt", "unit", "size", "radius"]);
	const fraction = () => (local.limit > 0 ? Math.min(1, Math.max(0, local.used / local.limit)) : 0);
	const percent = () => Math.round(fraction() * 100);
	const warn = () => fraction() >= (local.warnAt ?? 0.8);
	const suffix = () => (local.unit ? ` ${local.unit}` : "");
	return (
		<div class={`solidui-usage-meter ${local.class ?? ""}`.trim()} {...rest}>
			<div class={`mb-1 flex items-baseline justify-between gap-2 ${textSize[local.size ?? "md"]}`}>
				<span class="font-medium text-foreground">{local.label}</span>
				<span class="tabular-nums text-muted-foreground" role="status">
					{local.used}
					{suffix()} / {local.limit}
					{suffix()}
				</span>
			</div>
			<div
				role="progressbar"
				aria-label={local.label}
				aria-valuemin={0}
				aria-valuemax={local.limit}
				aria-valuenow={local.used}
				class={`w-full overflow-hidden bg-muted ${barHeight[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]}`}
			>
				<div
					class={`h-full transition-[width] duration-500 motion-reduce:transition-none ${warn() ? "bg-warning" : "bg-primary"}`}
					style={{ width: `${percent()}%` }}
				/>
			</div>
			<div
				class={`mt-1 text-right tabular-nums ${warn() ? "text-warning" : "text-muted-foreground"} ${textSize[local.size ?? "md"]}`}
			>
				{percent()}% used
			</div>
		</div>
	);
}
