/**
 * DataList — key/value rows with optional dividers.
 * @deprecated Use `PropertyList` with `layout="grid"` (or "split"/"table").
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius, SurfaceVariant } from "../lib/variants";
import { PropertyList } from "./PropertyList";

export interface DataListItem {
	term: string;
	description: JSX.Element;
}

export interface DataListProps extends JSX.HTMLAttributes<HTMLDListElement> {
	items?: DataListItem[];
	divided?: boolean;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DataList(props: DataListProps) {
	const [local, rest] = splitProps(props, [
		"items",
		"divided",
		"variant",
		"size",
		"radius",
		"elevation",
		"children",
		"class",
	]);
	return (
		<PropertyList
			layout="grid"
			items={local.items}
			size={local.size}
			radius={local.radius}
			elevation={local.elevation}
			class={`${local.divided ? "divide-y divide-border" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</PropertyList>
	);
}
