import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";

export interface DropdownMenuSeparatorProps extends JSX.HTMLAttributes<HTMLHRElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
	const [local, rest] = splitProps(props, ["class", "radius", "elevation"]);
	const className = () =>
		[
			"my-1 h-px bg-border",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return <hr class={className()} {...rest} />;
}
