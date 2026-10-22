/**
 * DataStrip — horizontal strip of `label: value` pairs separated by dividers.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface DataStripItem {
	/** Item label */
	label: string;
	/** Item value */
	value: string | number;
	/** Tooltip/hint text for the item */
	hint?: string;
}

export interface DataStripProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Label/value pairs to display */
	items: DataStripItem[];
	/** Show a divider between items @default true */
	divider?: boolean;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Allow horizontal scrolling when items overflow @default false */
	scrollable?: boolean;
}

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const gap = { sm: "gap-3", md: "gap-4", lg: "gap-6" } as const;

export function DataStrip(props: DataStripProps) {
	const [local, rest] = splitProps(props, ["class", "items", "divider", "size", "scrollable"]);
	return (
		<div
			class={`solidui-data-strip flex items-center ${gap[local.size ?? "md"]} ${local.scrollable ? "overflow-x-auto whitespace-nowrap" : "flex-wrap"} ${textSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items}>
				{(item, i) => (
					<>
						<Show when={(local.divider ?? true) && i() > 0}>
							<span aria-hidden="true" class="h-4 w-px shrink-0 bg-border" />
						</Show>
						<span class="inline-flex items-baseline gap-1.5" title={item.hint}>
							<span class="text-muted-foreground">{item.label}:</span>
							<span class="font-medium tabular-nums text-foreground">{item.value}</span>
						</span>
					</>
				)}
			</For>
		</div>
	);
}
