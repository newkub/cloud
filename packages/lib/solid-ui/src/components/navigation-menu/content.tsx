import { type JSX, Show, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { NavigationMenuContext, NavigationMenuItemContext } from "./context";

const contentAlignClass = {
	start: "left-0",
	center: "left-1/2 -translate-x-1/2",
	end: "right-0",
} as const;

export interface NavigationMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Alignment relative to the trigger. @default "start" */
	align?: "start" | "center" | "end";
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NavigationMenuContent(props: NavigationMenuContentProps) {
	const ctx = useContext(NavigationMenuContext);
	const item = useContext(NavigationMenuItemContext);
	const [local, rest] = splitProps(props, ["class", "children", "align", "radius", "elevation"]);

	if (!ctx || !item) {
		throw new Error("NavigationMenu.Content must be used inside a NavigationMenu and NavigationMenu.Item.");
	}

	const active = () => ctx.value() === item.value;
	const className = () =>
		[
			"absolute top-full z-popover mt-2 w-56 max-w-[calc(100vw-1rem)] border border-border bg-surface p-3 motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
			contentAlignClass[local.align ?? "start"],
			radiusMap[local.radius ?? "xl"],
			elevationMap[local.elevation ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={active()}>
			<div class={className()} data-state="open" {...rest}>
				{local.children}
			</div>
		</Show>
	);
}
