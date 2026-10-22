import { type JSX, splitProps } from "solid-js";
import {
	type ControlSize,
	type ControlVariant,
	controlSizes,
	controlVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
} from "../../lib/variants";
import { useDropdownMenuContext } from "./context";

export interface DropdownMenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual style of the trigger button. */
	variant?: ControlVariant;
	/** Density of the trigger button. */
	size?: ControlSize;
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "variant", "size", "radius", "elevation"]);
	const ctx = useDropdownMenuContext("DropdownMenu.Trigger");

	const className = () =>
		[
			"inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			local.variant ? controlVariants[local.variant] : "",
			local.size ? controlSizes[local.size] : "",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		ctx.toggle();
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button
			type="button"
			class={className()}
			ref={ctx.setTrigger}
			onClick={onClick}
			aria-haspopup="true"
			aria-expanded={ctx.open()}
			data-state={ctx.open() ? "open" : "closed"}
			{...rest}
		>
			{local.children}
		</button>
	);
}
