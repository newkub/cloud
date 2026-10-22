/**
 * KeyValueTable — two-column key/value rows (specs, metadata, settings).
 * @deprecated Use `PropertyList` with `layout="table"`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { PropertyList } from "./PropertyList";

export interface KeyValueRow {
	key: string;
	value: JSX.Element;
}

export interface KeyValueTableProps extends JSX.HTMLAttributes<HTMLDListElement> {
	rows: KeyValueRow[];
	/** Row density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Key column tone @default "muted" */
	variant?: "muted" | "striped";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function KeyValueTable(props: KeyValueTableProps) {
	const [local, rest] = splitProps(props, ["rows", "size", "variant", "radius", "elevation"]);
	return (
		<PropertyList
			layout="table"
			items={local.rows}
			size={local.size}
			variant={local.variant}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
