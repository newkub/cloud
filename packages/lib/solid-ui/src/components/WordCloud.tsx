/**
 * WordCloud - words sized by frequency.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, type Radius, radiusMap, type SurfaceVariant } from "../lib/variants";

export interface WordCloudItem {
	/** Primary text */
	label: string;
	/** Secondary text */
	description?: string;
	/** Leading icon */
	icon?: JSX.Element;
	/** Trailing badge text/count */
	badge?: string | number;
	/** Right-aligned meta text */
	meta?: string;
	/** Item link — renders an anchor */
	href?: string;
	/** Disabled state */
	disabled?: boolean;
	/** Click handler */
	onSelect?: (item: WordCloudItem) => void;
}

export interface WordCloudProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Row items */
	items?: WordCloudItem[];
	/** Called when a row is clicked */
	onSelect?: (item: WordCloudItem) => void;
	/** Rendered when items is empty */
	empty?: JSX.Element;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Words with weight */
	words?: { text: string; weight: number }[];
}

export function WordCloud(props: WordCloudProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"onSelect",
		"empty",
		"variant",
		"size",
		"radius",
		"elevation",
		"words",
	]);
	const gapCls = () => ({ sm: "gap-1.5", md: "gap-2", lg: "gap-3" })[local.size ?? "md"];
	return (
		<div class={`solidui-word-cloud grid grid-cols-2 sm:grid-cols-3 ${gapCls()} ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={(local.items ?? []).length === 0}>{local.empty}</Show>
			<For each={local.items}>
				{(item) => (
					<button
						type="button"
						disabled={item.disabled}
						class={`flex flex-col items-center gap-1 border border-border bg-surface p-3 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${radiusMap[local.radius ?? "lg"]}`}
						onClick={() => {
							item.onSelect?.(item);
							local.onSelect?.(item);
						}}
					>
						<Show when={item.icon}>
							<span class="text-muted-foreground" aria-hidden="true">
								{item.icon}
							</span>
						</Show>
						<span class="text-sm font-medium text-foreground">{item.label}</span>
						<Show when={item.description}>
							<span class="text-2xs text-muted-foreground">{item.description}</span>
						</Show>
					</button>
				)}
			</For>
		</div>
	);
}
