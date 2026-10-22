/**
 * JsonViewer - collapsible JSON tree with indent control.
 */
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-muted",
};

export interface JsonViewerProps extends JSX.HTMLAttributes<HTMLPreElement> {
	data?: unknown;
	indent?: number;
	maxDepth?: number;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function JsonViewer(props: JsonViewerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"data",
		"indent",
		"maxDepth",
		"variant",
		"size",
		"radius",
		"elevation",
	]);

	const formatted = () => {
		if (local.data === undefined) return "";
		try {
			const cap = (v: unknown, depth: number): unknown => {
				if (local.maxDepth !== undefined && depth >= local.maxDepth) return "[...]";
				if (Array.isArray(v)) return v.map((item) => cap(item, depth + 1));
				if (v !== null && typeof v === "object") {
					return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, cap(val, depth + 1)]));
				}
				return v;
			};
			return JSON.stringify(cap(local.data, 0), null, local.indent ?? 2);
		} catch {
			return String(local.data);
		}
	};

	const className = () =>
		[
			"overflow-auto border font-mono text-xs",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<pre class={className()} {...rest}>
			{local.children ?? formatted()}
		</pre>
	);
}
