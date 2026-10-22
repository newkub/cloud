/**
 * BottomNav — mobile bottom tab bar with icons, badges and optional center FAB.
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

export interface BottomNavItem {
	key: string;
	label: string;
	icon: JSX.Element;
	/** Active state. */
	active?: boolean;
	href?: string;
	onClick?: () => void;
	/** Numeric badge. */
	badge?: number | string;
	disabled?: boolean;
}

export interface BottomNavProps extends JSX.HTMLAttributes<HTMLElement> {
	items: BottomNavItem[];
	/** Center floating action button. */
	fab?: { icon: JSX.Element; onClick?: () => void; href?: string; label?: string };
	/** Fixed to the viewport bottom. @default true */
	fixed?: boolean;
	/** Hide labels, icons only. */
	compact?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius on the bar. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const iconSize = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" } as const;
const labelSize = { sm: "text-3xs", md: "text-2xs", lg: "text-xs" } as const;

export function BottomNav(props: BottomNavProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"fab",
		"fixed",
		"compact",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const items = () => local.items ?? [];
	const mid = () => Math.ceil(items().length / 2);
	const item = (it: BottomNavItem) => {
		const inner = (
			<>
				<span class={`relative ${iconSize[local.size ?? "md"]}`}>
					{it.icon}
					<Show when={it.badge !== undefined}>
						<span class="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-3xs font-semibold text-destructive-foreground">
							{it.badge}
						</span>
					</Show>
				</span>
				<Show when={!local.compact}>
					<span class={labelSize[local.size ?? "md"]}>{it.label}</span>
				</Show>
			</>
		);
		const cls = `flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
			it.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
		} ${it.disabled ? "pointer-events-none opacity-40" : ""}`;
		return it.href ? (
			<a href={it.href} class={cls} aria-current={it.active ? "page" : undefined} onClick={it.onClick}>
				{inner}
			</a>
		) : (
			<button
				type="button"
				class={cls}
				disabled={it.disabled}
				aria-current={it.active ? "page" : undefined}
				onClick={it.onClick}
			>
				{inner}
			</button>
		);
	};

	return (
		<nav
			aria-label="Bottom navigation"
			class={`solidui-bottom-nav ${(local.fixed ?? true) ? "fixed inset-x-0 bottom-0 z-40" : ""} ${surfaceVariants[local.variant ?? "default"]} border-t border-border ${local.elevation ? elevationMap[local.elevation] : "shadow-[0_-1px_4px_rgba(0,0,0,0.08)]"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative mx-auto flex max-w-lg items-stretch">
				<For each={items().slice(0, mid())}>{item}</For>
				<Show when={local.fab}>
					{(f) => (
						<div class="flex flex-1 items-center justify-center">
							<button
								type="button"
								aria-label={f().label ?? "Action"}
								class={`-mt-4 flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground shadow-lg transition-transform motion-reduce:transition-none motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "full"]}`}
								onClick={f().onClick}
							>
								<span class="h-5 w-5">{f().icon}</span>
							</button>
						</div>
					)}
				</Show>
				<For each={items().slice(mid())}>{item}</For>
			</div>
		</nav>
	);
}
