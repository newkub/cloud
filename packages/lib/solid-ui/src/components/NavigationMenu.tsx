/**
 * Navigation menu — `Trigger`/`Content`/`Link` live in `./navigation-menu/`
 * and are re-exported here so `from "./NavigationMenu"` keeps working.
 */
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap, surfaceVariants } from "../lib/variants";
import { NavigationMenuContext, NavigationMenuItemContext, nextNavigationMenuId } from "./navigation-menu/context";

export { NavigationMenuContent, type NavigationMenuContentProps } from "./navigation-menu/content";
export { NavigationMenuLink, type NavigationMenuLinkProps } from "./navigation-menu/link";
export { NavigationMenuTrigger, type NavigationMenuTriggerProps } from "./navigation-menu/trigger";

export interface NavigationMenuProps extends JSX.HTMLAttributes<HTMLElement> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NavigationMenu(props: NavigationMenuProps) {
	const merged = mergeProps({ defaultValue: "" }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"value",
		"defaultValue",
		"onValueChange",
		"variant",
		"size",
		"children",
	]);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const value = () => (local.value !== undefined ? local.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		local.onValueChange?.(next);
	};
	const baseId = nextNavigationMenuId();

	const className = () =>
		[
			"relative flex w-full items-center gap-1 ",
			surfaceVariants[local.variant ?? "default"],
			paddingSizes[local.size ?? "xs"],
			radiusMap[merged.radius ?? "lg"],
			merged.elevation ? elevationMap[merged.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		if (e.key === "Escape") {
			const trigger = e.currentTarget.querySelector<HTMLElement>('[aria-expanded="true"]');
			setValue("");
			trigger?.focus();
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const target = e.target as HTMLElement;
			if (target.getAttribute("aria-haspopup") !== "true") return;
			const triggers = Array.from(
				e.currentTarget.querySelectorAll<HTMLButtonElement>('[aria-haspopup="true"]:not([disabled])'),
			);
			const idx = triggers.indexOf(target as HTMLButtonElement);
			if (idx === -1) return;
			e.preventDefault();
			const next = triggers[(idx + (e.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length];
			next.focus();
			if (value()) next.click();
		}
	};

	return (
		<NavigationMenuContext.Provider value={{ value, setValue, baseId }}>
			<nav class={className()} aria-label="Main" onKeyDown={onKeyDown} {...rest}>
				{local.children}
			</nav>
		</NavigationMenuContext.Provider>
	);
}

export interface NavigationMenuItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
	const [local, rest] = splitProps(props, ["class", "value", "children", "radius", "elevation"]);
	return (
		<NavigationMenuItemContext.Provider value={{ value: local.value }}>
			<div
				class={[
					"relative",
					local.radius ? radiusMap[local.radius] : "",
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ")}
				{...rest}
			>
				{local.children}
			</div>
		</NavigationMenuItemContext.Provider>
	);
}
