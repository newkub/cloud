/**
 * Stat display with label, value, trend/delta, icon, spark and loading states.
 * `inline` renders a compact chip instead of a card.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type ChipVariant,
	chipVariants,
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface",
};

const chipSize = {
	xs: "px-1.5 py-0.5 text-2xs",
	sm: "px-1.5 py-0.5 text-xs",
	md: "px-2 py-0.5 text-xs",
	lg: "px-2.5 py-1 text-sm",
	xl: "px-3 py-1.5 text-sm",
} as const;

export interface StatProps extends JSX.HTMLAttributes<HTMLDivElement> {
	label?: string;
	value?: string | number;
	helpText?: string;
	/** Alias of helpText — JSX allowed. */
	hint?: JSX.Element;
	/** Trend — numbers render a signed percent with auto tone */
	trend?: number | string;
	trendLabel?: string;
	/** Signed delta with direction arrow and auto tone (trend alternative) */
	delta?: number;
	/** Delta suffix @default "%" */
	deltaSuffix?: string;
	/** Icon rendered beside the label (card) or before the label (inline) */
	icon?: JSX.Element;
	/** Mini bar strip under the value */
	spark?: number[];
	/** Render skeleton shimmer instead of the value */
	loading?: boolean;
	/** Compact chip layout @default false */
	inline?: boolean;
	/** Horizontal alignment @default "left" */
	align?: "left" | "center";
	variant?: SurfaceVariant;
	/** Chip tone override when `inline` */
	chipVariant?: ChipVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Stat(props: StatProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"label",
		"value",
		"helpText",
		"hint",
		"trend",
		"trendLabel",
		"delta",
		"deltaSuffix",
		"icon",
		"spark",
		"loading",
		"inline",
		"align",
		"variant",
		"chipVariant",
		"size",
		"children",
		"radius",
		"elevation",
	]);

	const displayValue = () => local.value ?? local.children;
	const deltaTone = () =>
		(local.delta ?? 0) > 0 ? "text-success" : (local.delta ?? 0) < 0 ? "text-destructive" : "text-muted-foreground";
	const deltaArrow = () => ((local.delta ?? 0) > 0 ? "▲" : (local.delta ?? 0) < 0 ? "▼" : "▬");
	const deltaText = () => `${(local.delta ?? 0) > 0 ? "+" : ""}${local.delta}${local.deltaSuffix ?? "%"}`;
	const sparkMax = () => Math.max(1e-9, ...(local.spark ?? []));

	if (local.inline) {
		return (
			<span
				class={`solidui-stat inline-flex items-center gap-1.5 border align-middle ${chipVariants[local.chipVariant ?? "default"]} ${chipSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${local.class ?? ""}`.trim()}
			>
				<Show when={local.icon}>
					<span class="shrink-0" aria-hidden="true">
						{local.icon}
					</span>
				</Show>
				<span class="font-medium">{local.label}</span>
				<span class="font-semibold tabular-nums text-foreground">{displayValue()}</span>
				<Show when={local.delta !== undefined}>
					<span class={`font-semibold tabular-nums ${deltaTone()}`}>
						<span aria-hidden="true">{deltaArrow()}</span>
						{deltaText()}
					</span>
				</Show>
			</span>
		);
	}

	const className = () =>
		[
			"space-y-1 border",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "sm"],
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.align === "center" ? "text-center" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const trendIsNumber = () => typeof local.trend === "number";
	const trendIsUp = () => trendIsNumber() && (local.trend as number) > 0;
	const trendIsDown = () => trendIsNumber() && (local.trend as number) < 0;

	const trendText = () => {
		if (trendIsNumber()) {
			const n = local.trend as number;
			const sign = n > 0 ? "+" : "";
			return `${sign}${n}%`;
		}
		return (local.trend as string | undefined) ?? "";
	};

	const trendClass = () => {
		if (trendIsUp()) return "text-success";
		if (trendIsDown()) return "text-destructive";
		return "text-muted-foreground";
	};

	return (
		<div class={className()} {...rest}>
			<Show when={local.label || local.icon}>
				<div
					class={`flex items-center gap-1.5 text-xs font-medium text-muted-foreground ${local.align === "center" ? "justify-center" : ""}`}
				>
					<Show when={local.icon}>
						<span class="shrink-0" aria-hidden="true">
							{local.icon}
						</span>
					</Show>
					{local.label}
				</div>
			</Show>
			<Show
				when={!local.loading}
				fallback={<div class="h-7 w-24 motion-safe:animate-pulse rounded bg-muted" aria-hidden="true" />}
			>
				<div class="text-xl font-bold text-foreground tabular-nums">{displayValue()}</div>
			</Show>
			<Show when={local.trend || local.helpText || local.hint || local.delta !== undefined}>
				<div class={`flex items-center gap-2 text-xs ${local.align === "center" ? "justify-center" : ""}`}>
					<Show when={local.trend}>
						<span class={trendClass()}>{trendText()}</span>
					</Show>
					<Show when={local.delta !== undefined}>
						<span class={`font-semibold tabular-nums ${deltaTone()}`}>
							<span aria-hidden="true">{deltaArrow()}</span>
							{deltaText()}
						</span>
					</Show>
					<Show when={local.helpText ?? local.hint}>
						<span class="text-muted-foreground">{local.helpText ?? local.hint}</span>
					</Show>
					<Show when={local.trendLabel}>
						<span class="text-muted-foreground">{local.trendLabel}</span>
					</Show>
				</div>
			</Show>
			<Show when={(local.spark ?? []).length > 0}>
				<div
					class={`mt-1 flex h-4 items-end gap-0.5 ${local.align === "center" ? "justify-center" : ""}`}
					role="img"
					aria-label={local.label ? `Sparkline for ${local.label}` : "Sparkline"}
				>
					<For each={local.spark ?? []}>
						{(n) => (
							<div
								class="w-1 rounded-sm bg-primary/70 transition-[height] motion-reduce:transition-none"
								style={{ height: `${Math.max(8, (n / sparkMax()) * 100)}%` }}
								aria-hidden="true"
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
