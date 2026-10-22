/**
 * Tabs - tabbed content switcher (pills or underline styles).
 * `TabsList`/`TabsTrigger`/`TabsContent` live in `./tabs/` and are
 * re-exported here so `from "./Tabs"` keeps working.
 */
import { createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { nextTabsId, TabsContext } from "./tabs/context";

export { TabsContent, type TabsContentProps } from "./tabs/content";
export { TabsList, type TabsListProps } from "./tabs/list";
export { TabsTrigger, type TabsTriggerProps } from "./tabs/trigger";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Tabs(props: TabsProps) {
	const merged = mergeProps({ defaultValue: "" }, props);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const value = () => (props.value !== undefined ? props.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		props.onValueChange?.(next);
	};
	const baseId = nextTabsId();

	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onValueChange",
		"variant",
		"size",
		"children",
		"radius",
		"elevation",
	]);
	const className = () =>
		[
			"w-full",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<TabsContext.Provider value={{ value, setValue, baseId }}>
			<div class={className()} {...rest}>
				{local.children}
			</div>
		</TabsContext.Provider>
	);
}
