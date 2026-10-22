import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { triggerSizeMap } from "./constants";
import { useMenubarContext, useMenubarMenuContext } from "./context";

export interface MenubarTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Density of the trigger. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MenubarTrigger(props: MenubarTriggerProps) {
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "size", "radius", "elevation"]);
	const ctx = useMenubarContext("Menubar.Trigger");
	const menu = useMenubarMenuContext("Menubar.Trigger");

	const active = () => ctx.value() === menu.value;
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
		ctx.setValue(active() ? "" : menu.value);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button
			type="button"
			class={className()}
			onClick={onClick}
			aria-haspopup="menu"
			aria-expanded={active()}
			data-state={active() ? "open" : "closed"}
			{...rest}
		>
			{local.children}
		</button>
	);
}
