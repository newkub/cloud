/**
 * QuotaBar — used/total progress bar with warning and danger thresholds.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface QuotaBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Amount used */
	used: number;
	/** Total capacity */
	total: number;
	/** Label shown above the bar (also the aria-label) @default "Usage" */
	label?: string;
	/** Custom formatter for the used/total numbers */
	format?: (n: number) => string;
	/** Usage fraction (0–1) at which the bar turns warning */
	warnAt?: number;
	/** Usage fraction (0–1) at which the bar turns destructive */
	dangerAt?: number;
	/** Show "used / total" values next to the label @default true */
	showValues?: boolean;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const barHeight = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;
const textSize = { sm: "text-xs", md: "text-xs", lg: "text-sm" } as const;

export function QuotaBar(props: QuotaBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"used",
		"total",
		"label",
		"format",
		"warnAt",
		"dangerAt",
		"showValues",
		"size",
		"radius",
	]);
	const fraction = () => (local.total > 0 ? Math.min(1, Math.max(0, local.used / local.total)) : 0);
	const barCls = () =>
		local.dangerAt !== undefined && fraction() >= local.dangerAt
			? "bg-destructive"
			: local.warnAt !== undefined && fraction() >= local.warnAt
				? "bg-warning"
				: "bg-primary";
	const fmt = (n: number) => (local.format ? local.format(n) : `${n}`);
	return (
		<div class={`solidui-quota-bar ${local.class ?? ""}`.trim()} {...rest}>
			<div class={`mb-1 flex items-baseline justify-between gap-2 ${textSize[local.size ?? "md"]}`}>
				<span class="font-medium text-foreground">{local.label ?? "Usage"}</span>
				<Show when={local.showValues ?? true}>
					<span class="tabular-nums text-muted-foreground" role="status">
						{fmt(local.used)} / {fmt(local.total)}
					</span>
				</Show>
			</div>
			<div
				role="progressbar"
				aria-label={local.label ?? "Usage"}
				aria-valuemin={0}
				aria-valuemax={local.total}
				aria-valuenow={local.used}
				class={`w-full overflow-hidden bg-muted ${barHeight[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]}`}
			>
				<div
					class={`h-full ${barCls()} transition-[width] duration-500 motion-reduce:transition-none`}
					style={{ width: `${fraction() * 100}%` }}
				/>
			</div>
		</div>
	);
}
