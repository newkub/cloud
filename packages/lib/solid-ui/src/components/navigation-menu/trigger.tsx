import { type JSX, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { NavigationMenuContext, NavigationMenuItemContext } from "./context";

const triggerSizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-2 py-1 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-4 py-2.5 text-base",
};

export interface NavigationMenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Density of the trigger. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
	const ctx = useContext(NavigationMenuContext);
	const item = useContext(NavigationMenuItemContext);
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "size", "radius", "elevation"]);

	if (!ctx || !item) {
		throw new Error("NavigationMenu.Trigger must be used inside a NavigationMenu and NavigationMenu.Item.");
	}

	const active = () => ctx.value() === item.value;
	const className = () =>
		[
			"inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			triggerSizeMap[local.size ?? "md"],
			active() ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted hover:text-foreground",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		ctx.setValue(active() ? "" : item.value);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button
			type="button"
			class={className()}
			onClick={onClick}
			aria-haspopup="true"
			aria-expanded={active()}
			data-state={active() ? "open" : "closed"}
			{...rest}
		>
			{local.children}
		</button>
	);
}
