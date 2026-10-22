import { type JSX, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { TabsContext, TabsListContext } from "./context";

export interface TabsTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TabsTrigger(props: TabsTriggerProps) {
	const context = useContext(TabsContext);
	const listVariant = useContext(TabsListContext) ?? (() => "pills" as const);
	const [local, rest] = splitProps(props, ["class", "value", "children", "onClick", "radius", "elevation"]);

	if (!context) {
		throw new Error("Tabs.Trigger must be used inside a Tabs.");
	}

	const active = () => context.value() === local.value;
	const className = () => {
		if (listVariant() === "underline") {
			return [
				"inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent -mb-px px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
				active() ? "border-primary text-foreground" : "text-muted-foreground hover:border-border hover:text-foreground",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ");
		}
		const base =
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
		return [
			base,
			active()
				? "bg-background text-foreground shadow-sm"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	};

	const onClick = (e: MouseEvent) => {
		context.setValue(local.value);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button
			type="button"
			role="tab"
			aria-selected={active()}
			aria-controls={`${context.baseId}-content-${local.value}`}
			id={`${context.baseId}-trigger-${local.value}`}
			tabIndex={active() ? 0 : -1}
			class={className()}
			onClick={onClick}
			{...rest}
		>
			{local.children}
		</button>
	);
}
