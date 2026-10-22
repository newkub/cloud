/**
 * CryptoCard - coin card with price, spark and market cap.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CryptoCardItem {
	/** Primary text */
	label: string;
	/** Secondary text */
	description?: string;
	/** Leading icon */
	icon?: JSX.Element;
	/** Trailing badge text/count */
	badge?: string | number;
	/** Right-aligned meta text */
	meta?: string;
	/** Item link — renders an anchor */
	href?: string;
	/** Disabled state */
	disabled?: boolean;
	/** Click handler */
	onSelect?: (item: CryptoCardItem) => void;
}

export interface CryptoCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card title */
	title?: string;
	/** Secondary title text */
	subtitle?: string;
	/** Leading icon or media */
	icon?: JSX.Element;
	/** Key fields shown as label/value rows */
	items?: CryptoCardItem[];
	/** Trailing actions slot */
	actions?: JSX.Element;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Coin symbol */
	symbol?: string;
	/** Price */
	price?: number;
	/** 24h change % */
	change24h?: number;
	/** Market cap */
	marketCap?: string;
}

export function CryptoCard(props: CryptoCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"subtitle",
		"icon",
		"items",
		"actions",
		"variant",
		"size",
		"radius",
		"elevation",
		"children",
		"symbol",
		"price",
		"change24h",
		"marketCap",
	]);
	const pad = { sm: "p-3 text-xs", md: "p-4 text-sm", lg: "p-6 text-base" } as const;
	const cls = () =>
		[
			"solidui-crypto-card border border-border bg-surface",
			surfaceVariants[local.variant ?? "default"],
			pad[local.size ?? "md"],
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={cls()} {...rest}>
			<Show when={local.title || local.icon || local.actions}>
				<div class="mb-3 flex items-start justify-between gap-3">
					<div class="flex items-center gap-2">
						<Show when={local.icon}>
							<span class="shrink-0 text-muted-foreground" aria-hidden="true">
								{local.icon}
							</span>
						</Show>
						<div>
							<Show when={local.title}>
								<div class="font-semibold text-foreground">{local.title}</div>
							</Show>
							<Show when={local.subtitle}>
								<div class="text-xs text-muted-foreground">{local.subtitle}</div>
							</Show>
						</div>
					</div>
					<Show when={local.actions}>{local.actions}</Show>
				</div>
			</Show>
			{local.children}
			<Show when={(local.items ?? []).length > 0}>
				<dl class="mt-3 space-y-1.5">
					<For each={local.items}>
						{(item) => (
							<div class="flex items-center justify-between gap-4 text-sm">
								<dt class="flex items-center gap-1.5 text-muted-foreground">
									{item.icon}
									{item.label}
								</dt>
								<dd class="font-medium tabular-nums text-foreground">{item.meta ?? item.badge ?? item.description}</dd>
							</div>
						)}
					</For>
				</dl>
			</Show>
		</div>
	);
}
