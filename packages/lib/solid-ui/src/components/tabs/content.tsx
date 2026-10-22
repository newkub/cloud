import { type JSX, Show, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { TabsContext } from "./context";

export interface TabsContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TabsContent(props: TabsContentProps) {
	const context = useContext(TabsContext);
	const [local, rest] = splitProps(props, ["class", "value", "children", "radius", "elevation"]);

	if (!context) {
		throw new Error("Tabs.Content must be used inside a Tabs.");
	}

	const active = () => context.value() === local.value;
	const className = () =>
		[
			"mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={active()}>
			<div
				role="tabpanel"
				id={`${context.baseId}-content-${local.value}`}
				aria-labelledby={`${context.baseId}-trigger-${local.value}`}
				class={className()}
				{...rest}
			>
				{local.children}
			</div>
		</Show>
	);
}
