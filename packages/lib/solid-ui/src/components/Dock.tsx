/**
 * Dock — macOS-style icon dock with hover magnification.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DockItem {
	/** Item label — shown as tooltip */
	label: string;
	/** Icon content (emoji, svg, text) */
	icon?: JSX.Element;
	href?: string;
	onClick?: () => void;
	/** Highlight as active @default false */
	active?: boolean;
}

export interface DockProps extends JSX.HTMLAttributes<HTMLElement> {
	items: DockItem[];
	/** Icon size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Container surface @default "default" */
	variant?: "default" | "floating" | "outline";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const iconSize = { sm: "h-8 w-8 text-base", md: "h-10 w-10 text-lg", lg: "h-12 w-12 text-xl" } as const;
const containerVariant = {
	default: "border-border bg-surface shadow-sm",
	floating: "border-border bg-surface/80 shadow-lg backdrop-blur",
	outline: "border-dashed border-border bg-transparent",
} as const;

export function Dock(props: DockProps) {
	const [local, rest] = splitProps(props, ["class", "items", "size", "variant", "radius", "elevation"]);
	const itemCls = (item: DockItem) =>
		`flex ${iconSize[local.size ?? "md"]} items-center justify-center rounded-xl transition-transform duration-150 motion-reduce:transition-none motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
			item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
		}`;
	return (
		<nav
			aria-label="Dock"
			class={`solidui-dock inline-flex items-end gap-1 border p-2 ${containerVariant[local.variant ?? "default"]} ${radiusMap[local.radius ?? "2xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items}>
				{(item) =>
					item.href ? (
						<a href={item.href} title={item.label} aria-label={item.label} class={itemCls(item)}>
							{item.icon ?? item.label.charAt(0)}
						</a>
					) : (
						<button
							type="button"
							title={item.label}
							aria-label={item.label}
							class={itemCls(item)}
							onClick={item.onClick}
						>
							{item.icon ?? item.label.charAt(0)}
						</button>
					)
				}
			</For>
		</nav>
	);
}
