/**
 * SortableList — ordered list with up/down reorder controls.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SortableItem {
	id: string;
	label: string;
}

export interface SortableListProps extends Omit<JSX.HTMLAttributes<HTMLUListElement>, "onReorder"> {
	items: SortableItem[];
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	onReorder?: (items: SortableItem[]) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const rowSize = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-sm" } as const;

export function SortableList(props: SortableListProps) {
	const [local, rest] = splitProps(props, ["class", "items", "size", "onReorder", "radius", "elevation"]);
	const [internal, setInternal] = createSignal<SortableItem[]>([]);
	const items = () => (local.items?.length ? local.items : internal());
	const move = (i: number, dir: -1 | 1) => {
		const list = [...items()];
		const j = i + dir;
		if (j < 0 || j >= list.length) return;
		[list[i], list[j]] = [list[j], list[i]];
		setInternal(list);
		local.onReorder?.(list);
	};
	const btn =
		"flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40";
	return (
		<ul
			class={`solidui-sortable-list divide-y divide-border rounded-lg border border-border bg-surface ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={items()}>
				{(item, i) => (
					<li
						class={`flex items-center gap-2 ${rowSize[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`}
					>
						<span class="flex flex-col">
							<button
								type="button"
								class={btn}
								aria-label={`Move ${item.label} up`}
								disabled={i() === 0}
								onClick={() => move(i(), -1)}
							>
								▲
							</button>
							<button
								type="button"
								class={btn}
								aria-label={`Move ${item.label} down`}
								disabled={i() === items().length - 1}
								onClick={() => move(i(), 1)}
							>
								▼
							</button>
						</span>
						<span class="min-w-0 flex-1 truncate">{item.label}</span>
					</li>
				)}
			</For>
		</ul>
	);
}
