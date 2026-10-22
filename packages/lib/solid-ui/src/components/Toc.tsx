/**
 * Toc component — nested table of contents with active-item highlighting.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TocItem {
	id: string;
	text: string;
	level?: number;
	children?: TocItem[];
}

export interface TocProps extends JSX.HTMLAttributes<HTMLElement> {
	items: TocItem[];
	/** Currently active item id — link gets an active style. */
	activeId?: string;
	/** Called when an item is clicked; default anchor navigation still occurs. */
	onItemClick?: (id: string) => void;
	/** Maximum nesting depth rendered (default 6). */
	maxDepth?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Toc(props: TocProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"activeId",
		"onItemClick",
		"maxDepth",
		"radius",
		"elevation",
	]);

	const renderItem = (item: TocItem, depth = 0): JSX.Element => {
		if (depth >= (local.maxDepth ?? 6)) return null;
		const isActive = () => local.activeId === item.id;
		return (
			<li>
				<a
					href={`#${item.id}`}
					class={`block rounded-md px-2 py-1.5 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
						depth > 0 ? "ml-3" : ""
					} ${isActive() ? "font-medium text-primary" : "text-muted-foreground"}`}
					aria-current={isActive() ? "location" : undefined}
					onClick={() => local.onItemClick?.(item.id)}
				>
					{item.text}
				</a>
				<Show when={item.children?.length}>
					<ul>
						<For each={item.children}>{(child) => renderItem(child, depth + 1)}</For>
					</ul>
				</Show>
			</li>
		);
	};

	return (
		<nav
			class={[
				"text-sm",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			aria-label="Table of contents"
			{...rest}
		>
			<ul class="space-y-0.5">
				<For each={local.items}>{(item) => renderItem(item)}</For>
			</ul>
		</nav>
	);
}
