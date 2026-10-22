/**
 * BentoGrid — bento-box layout; items declare their own column/row spans.
 */
import { For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface BentoItem {
	/** Column span 1–4. @default 1 */
	colSpan?: 1 | 2 | 3 | 4;
	/** Row span 1–3. @default 1 */
	rowSpan?: 1 | 2 | 3;
	content: JSX.Element;
	/** Per-item variant override. */
	variant?: SurfaceVariant;
}

export interface BentoGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: BentoItem[];
	/** Grid columns at lg breakpoint. @default 4 */
	columns?: 2 | 3 | 4;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius on cells. */
	radius?: Radius;
	/** Shadow elevation on cells. */
	elevation?: Elevation;
	/** Gap between cells. @default "0.75rem" */
	gap?: string;
}

const colMap = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;
const colSpanMap = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" } as const;
const rowSpanMap = { 1: "", 2: "lg:row-span-2", 3: "lg:row-span-3" } as const;
const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;

export function BentoGrid(props: BentoGridProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"columns",
		"variant",
		"size",
		"radius",
		"elevation",
		"gap",
	]);
	return (
		<div
			class={`solidui-bento-grid grid grid-cols-1 sm:grid-cols-2 ${colMap[local.columns ?? 4]} ${local.class ?? ""}`.trim()}
			style={{ gap: local.gap ?? "0.75rem" }}
			{...rest}
		>
			<For each={local.items}>
				{(item) => (
					<div
						class={`min-h-24 ${surfaceVariants[item.variant ?? local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${colSpanMap[item.colSpan ?? 1]} ${rowSpanMap[item.rowSpan ?? 1]}`.trim()}
					>
						{item.content}
					</div>
				)}
			</For>
		</div>
	);
}
