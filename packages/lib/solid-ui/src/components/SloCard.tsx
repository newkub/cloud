/**
 * SloCard — SLO card with progress-to-target bar and breach warning state.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SloCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** SLO name, e.g. "API availability". */
	name: string;
	/** Target value — `current` must meet or exceed it. */
	target: number;
	/** Current measured value. */
	current: number;
	/** Reporting window label, e.g. "30d". */
	window?: string;
	/** Unit suffix appended to values @default "%" */
	unit?: string;
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const valueSize = { sm: "text-lg", md: "text-xl", lg: "text-2xl" } as const;

export function SloCard(props: SloCardProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-slo-card border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: paddingSizes,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["name", "target", "current", "window", "unit", "children"]);
	const unit = () => local.unit ?? "%";
	const breached = () => local.current < local.target;
	const progress = () => (local.target > 0 ? Math.min(1, Math.max(0, local.current / local.target)) : 0);
	const statusText = () => (breached() ? "Breached" : "On track");
	return (
		<div class={className()} {...dom}>
			<div class="flex items-start justify-between gap-2">
				<h3 class="min-w-0 truncate text-sm font-semibold text-foreground">{local.name}</h3>
				<div class="flex shrink-0 items-center gap-1">
					<Show when={local.window}>
						<span
							class={`inline-flex items-center rounded border px-1.5 py-0.5 font-medium text-2xs ${chipVariants.default}`}
						>
							{local.window}
						</span>
					</Show>
					<span
						class={`inline-flex items-center rounded border px-1.5 py-0.5 font-medium text-2xs ${
							breached() ? chipVariants.destructive : chipVariants.success
						}`}
					>
						{statusText()}
					</span>
				</div>
			</div>
			<div class="mt-1 flex items-baseline gap-2">
				<span
					class={`font-bold tracking-tight tabular-nums ${valueSize[props.size ?? "md"]} ${breached() ? "text-destructive" : "text-foreground"}`}
				>
					{local.current}
					{unit()}
				</span>
				<span class="text-xs tabular-nums text-muted-foreground">
					target {local.target}
					{unit()}
				</span>
			</div>
			<div
				role="progressbar"
				aria-label={`${local.name} progress to target`}
				aria-valuemin={0}
				aria-valuemax={local.target}
				aria-valuenow={local.current}
				class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
			>
				<div
					class={`h-full transition-[width] duration-500 motion-reduce:transition-none ${breached() ? "bg-destructive" : "bg-success"}`}
					style={{ width: `${progress() * 100}%` }}
				/>
			</div>
			<Show when={breached()}>
				<p class="mt-2 text-2xs font-medium text-destructive" role="alert">
					SLO breach — {local.current}
					{unit()} is below the {local.target}
					{unit()} target
				</p>
			</Show>
			{local.children}
		</div>
	);
}
