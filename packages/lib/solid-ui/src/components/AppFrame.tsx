/**
 * AppFrame - app chrome: header, nav rail and content slots.
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

export interface AppFrameItem {
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
	onSelect?: (item: AppFrameItem) => void;
}

export interface AppFrameProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card title */
	title?: string;
	/** Secondary title text */
	subtitle?: string;
	/** Leading icon or media */
	icon?: JSX.Element;
	/** Key fields shown as label/value rows */
	items?: AppFrameItem[];
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
	/** Header slot */
	header?: JSX.Element;
	/** Nav slot */
	nav?: JSX.Element;
	/** Footer slot */
	footer?: JSX.Element;
}

export function AppFrame(props: AppFrameProps) {
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
		"header",
		"nav",
		"footer",
	]);
	const pad = { sm: "p-3 text-xs", md: "p-4 text-sm", lg: "p-6 text-base" } as const;
	const cls = () =>
		[
			"solidui-app-frame border border-border bg-surface",
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
