/**
 * EisenhowerMatrix - 2×2 urgent/important quadrant board with click-to-move item cards.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type EisenhowerQuadrant = "do" | "schedule" | "delegate" | "delete";

export interface EisenhowerItem {
	/** Unique item id. */
	id: string | number;
	/** Item title. */
	title: string;
	/** Urgency flag. */
	urgent: boolean;
	/** Importance flag. */
	important: boolean;
}

export interface EisenhowerMatrixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Items to place on the board. */
	items?: EisenhowerItem[];
	/** Called when an item is moved to another quadrant. */
	onMove?: (id: string | number, quadrant: EisenhowerQuadrant) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const quadrants: { key: EisenhowerQuadrant; label: string; hint: string; chip: string }[] = [
	{
		key: "do",
		label: "Do",
		hint: "Urgent · Important",
		chip: "border-destructive/30 bg-destructive/10 text-destructive",
	},
	{ key: "schedule", label: "Schedule", hint: "Not urgent · Important", chip: "border-info/30 bg-info/10 text-info" },
	{
		key: "delegate",
		label: "Delegate",
		hint: "Urgent · Not important",
		chip: "border-warning/30 bg-warning/10 text-warning",
	},
	{
		key: "delete",
		label: "Delete",
		hint: "Not urgent · Not important",
		chip: "border-border bg-muted text-muted-foreground",
	},
];

const quadrantOf = (item: EisenhowerItem): EisenhowerQuadrant =>
	item.urgent && item.important
		? "do"
		: !item.urgent && item.important
			? "schedule"
			: item.urgent && !item.important
				? "delegate"
				: "delete";

export function EisenhowerMatrix(props: EisenhowerMatrixProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-eisenhower-matrix grid grid-cols-1 gap-3 sm:grid-cols-2",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["items", "onMove"]);

	// Local quadrant overrides for uncontrolled moves.
	const [moves, setMoves] = createSignal<Record<string, EisenhowerQuadrant>>({});
	const placed = (item: EisenhowerItem) => moves()[String(item.id)] ?? quadrantOf(item);
	const itemsIn = (key: EisenhowerQuadrant) => (local.items ?? []).filter((item) => placed(item) === key);
	const move = (item: EisenhowerItem, quadrant: EisenhowerQuadrant) => {
		setMoves((m) => ({ ...m, [String(item.id)]: quadrant }));
		local.onMove?.(item.id, quadrant);
	};

	return (
		<div class={className()} {...rest}>
			<For each={quadrants}>
				{(quadrant) => (
					<section
						aria-label={`${quadrant.label} quadrant`}
						class="flex min-h-28 flex-col gap-2 border border-border bg-surface p-3"
					>
						<header class="flex items-center justify-between gap-2">
							<span
								class={`inline-flex items-center rounded border px-1.5 py-0.5 text-2xs font-semibold ${quadrant.chip}`}
							>
								{quadrant.label}
							</span>
							<span class="text-2xs text-muted-foreground">{quadrant.hint}</span>
						</header>
						<ul class="flex flex-col gap-1.5" aria-label={`${quadrant.label} items`}>
							<For each={itemsIn(quadrant.key)}>
								{(item) => (
									<li class="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2 py-1.5">
										<span class="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{item.title}</span>
										<select
											aria-label={`Move ${item.title}`}
											class="h-6 rounded border border-input bg-background px-1 text-2xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={placed(item)}
											onChange={(e) => move(item, e.currentTarget.value as EisenhowerQuadrant)}
										>
											<For each={quadrants}>{(q) => <option value={q.key}>{q.label}</option>}</For>
										</select>
									</li>
								)}
							</For>
						</ul>
					</section>
				)}
			</For>
		</div>
	);
}
