/**
 * ReceiptCard - paper-receipt panel with zigzag torn edges, dashed rules, and monospace totals.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ReceiptItem {
	label: string;
	/** Amount — numbers render with two decimals. */
	amount: string | number;
}

export interface ReceiptCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Receipt heading, e.g. "ORDER #1042". */
	title?: string;
	items?: ReceiptItem[];
	/** Total — numbers render with two decimals; falls back to the sum of numeric items. */
	total?: string | number;
	/** Label for the total row. @default "Total" */
	totalLabel?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

/** Card-colored upward teeth for the top edge (conic zigzag). */
const teethTop: JSX.CSSProperties = {
	"background-image": "conic-gradient(from 135deg at 50% 0%, hsl(var(--color-card)) 0deg 90deg, transparent 90deg)",
	"background-size": "16px 8px",
	"background-repeat": "repeat-x",
};

/** Card-colored downward teeth for the bottom edge (conic zigzag). */
const teethBottom: JSX.CSSProperties = {
	"background-image": "conic-gradient(from -45deg at 50% 100%, hsl(var(--color-card)) 0deg 90deg, transparent 90deg)",
	"background-size": "16px 8px",
	"background-repeat": "repeat-x",
};

const fmt = (v: string | number) => (typeof v === "number" ? v.toFixed(2) : v);

export function ReceiptCard(props: ReceiptCardProps) {
	const [local, restProps] = splitProps(props, ["title", "items", "total", "totalLabel", "children"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-receipt-card inline-block max-w-full",
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap, default: "sm" },
		],
	});

	const items = () => local.items ?? [];
	const resolvedTotal = () => {
		if (local.total !== undefined) return local.total;
		const list = items();
		if (list.length > 0 && list.every((i) => typeof i.amount === "number")) {
			return list.reduce((sum, i) => sum + (i.amount as number), 0);
		}
		return undefined;
	};

	return (
		<div class={className()} {...rest}>
			<span aria-hidden="true" class="block h-2 w-full" style={teethTop} />
			<div class="bg-card px-5 py-4 font-mono text-xs text-card-foreground">
				<Show when={local.title}>
					<div class="text-center text-sm font-bold uppercase tracking-widest">{local.title}</div>
				</Show>
				<div class="my-3 border-t border-dashed border-border" aria-hidden="true" />
				<For each={items()}>
					{(item) => (
						<div class="flex items-baseline justify-between gap-4 py-0.5">
							<span class="min-w-0 truncate">{item.label}</span>
							<span class="shrink-0 tabular-nums">{fmt(item.amount)}</span>
						</div>
					)}
				</For>
				{local.children}
				<Show when={resolvedTotal() !== undefined}>
					<div class="my-3 border-t border-dashed border-border" aria-hidden="true" />
					<div class="flex items-baseline justify-between gap-4 text-sm font-bold">
						<span class="uppercase">{local.totalLabel ?? "Total"}</span>
						<span class="tabular-nums">{fmt(resolvedTotal() as string | number)}</span>
					</div>
				</Show>
			</div>
			<span aria-hidden="true" class="block h-2 w-full" style={teethBottom} />
		</div>
	);
}
