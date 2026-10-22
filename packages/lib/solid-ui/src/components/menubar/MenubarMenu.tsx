import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { MenubarMenuContext } from "./context";

export interface MenubarMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MenubarMenu(props: MenubarMenuProps) {
	const [local, rest] = splitProps(props, ["class", "value", "children", "radius", "elevation"]);
	return (
		<MenubarMenuContext.Provider value={{ value: local.value }}>
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
		</MenubarMenuContext.Provider>
	);
}
