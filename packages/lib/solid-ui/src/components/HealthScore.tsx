/**
 * HealthScore - 0-100 score bar with good/fair/poor zones.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type chipVariants, type Radius, radiusMap } from "../lib/variants";

export interface HealthScoreProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current value @default 0 */
	value?: number;
	/** Scale minimum @default 0 */
	min?: number;
	/** Scale maximum @default 100 */
	max?: number;
	/** Bar label */
	label?: string;
	/** Show the numeric value @default true */
	showValue?: boolean;
	/** Format the numeric value */
	format?: (value: number) => string;
	/** Fill tone @default "primary" */
	variant?: keyof typeof chipVariants;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. @default "full" */
	radius?: Radius;
	/** Zone edges [fair, good] @default [50, 80] */
	zones?: [number, number];
}

export function HealthScore(props: HealthScoreProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"min",
		"max",
		"label",
		"showValue",
		"format",
		"variant",
		"size",
		"radius",
		"children",
		"zones",
	]);
	const frac = () => Math.min(1, Math.max(0, (local.value ?? 0) / ((local.max ?? 100) - (local.min ?? 0) || 1)));
	const text = () => (local.format ? local.format(local.value ?? 0) : `${local.value ?? 0}`);
	return (
		<div class={`solidui-health-score w-full ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.label || (local.showValue ?? true)}>
				<div class="mb-1 flex items-baseline justify-between gap-2">
					<Show when={local.label}>
						<span class="text-xs font-medium text-muted-foreground">{local.label}</span>
					</Show>
					<Show when={local.showValue ?? true}>
						<span class="text-xs font-semibold tabular-nums text-foreground">{text()}</span>
					</Show>
				</div>
			</Show>
			<meter
				class="sr-only"
				min={local.min ?? 0}
				max={local.max ?? 100}
				value={local.value ?? 0}
				aria-label={local.label ?? "HealthScore"}
			>
				{text()}
			</meter>
			<div
				aria-hidden="true"
				class={`w-full overflow-hidden bg-muted ${{ sm: "h-1", md: "h-2", lg: "h-3" }[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]}`}
			>
				<div
					class={`h-full transition-[width] motion-reduce:transition-none ${({ default: "bg-primary", primary: "bg-primary", secondary: "bg-secondary", outline: "bg-primary", success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" } as Record<string, string>)[local.variant ?? "primary"] ?? "bg-primary"}`}
					style={{ width: `${frac() * 100}%` }}
				/>
			</div>
			{local.children}
		</div>
	);
}
