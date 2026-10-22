/**
 * Windowed virtual list
 */
import { createMemo, createSignal, For, type JSX, mergeProps, onMount } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface VirtualListProps {
	itemCount: number;
	itemHeight: number;
	renderItem: (index: number) => JSX.Element;
	overscan?: number;
	height?: number | string;
	width?: number | string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function useVirtualList(props: VirtualListProps) {
	const merged = mergeProps({ overscan: 3 }, props);
	const [container, setContainer] = createSignal<HTMLDivElement | undefined>();
	const [scrollTop, setScrollTop] = createSignal(0);
	const [clientHeight, setClientHeight] = createSignal(0);

	const totalHeight = () => merged.itemCount * merged.itemHeight;

	const visibleRange = createMemo(() => {
		const top = scrollTop();
		const height = clientHeight() || totalHeight();
		const start = Math.max(0, Math.floor(top / merged.itemHeight) - merged.overscan);
		const end = Math.min(merged.itemCount - 1, Math.ceil((top + height) / merged.itemHeight) + merged.overscan);
		return { start, end };
	});

	const visibleItems = createMemo(() => {
		const range = visibleRange();
		const items: number[] = [];
		for (let i = range.start; i <= range.end; i++) items.push(i);
		return items;
	});

	const onScroll = (e: Event) => {
		const target = e.currentTarget as HTMLDivElement;
		setScrollTop(target.scrollTop);
		setClientHeight(target.clientHeight);
	};

	onMount(() => {
		const el = container();
		if (el) {
			setClientHeight(el.clientHeight);
			setScrollTop(el.scrollTop);
		}
	});

	const sizeStyle = (value: number | string | undefined) =>
		typeof value === "number" ? `${value}px` : (value ?? "100%");

	return {
		merged,
		setContainer,
		totalHeight,
		visibleItems,
		onScroll,
		sizeStyle,
	};
}

export function VirtualList(props: VirtualListProps) {
	const { merged, setContainer, totalHeight, visibleItems, onScroll, sizeStyle } = useVirtualList(props);

	return (
		<div
			class={[
				"relative overflow-auto",
				merged.variant ? surfaceVariants[merged.variant] : "",
				merged.size ? paddingSizes[merged.size] : "",
				props.radius ? radiusMap[props.radius] : "",
				props.elevation ? elevationMap[props.elevation] : "",
				merged.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{ height: sizeStyle(merged.height), width: sizeStyle(merged.width) }}
			onScroll={onScroll}
			ref={setContainer}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so keyboard users can scroll the viewport
			tabIndex={0}
		>
			<div class="relative w-full" style={{ height: `${totalHeight()}px` }}>
				<For each={visibleItems()}>
					{(index) => (
						<div
							class="absolute left-0 w-full"
							style={{ top: `${index * merged.itemHeight}px`, height: `${merged.itemHeight}px` }}
						>
							{merged.renderItem(index)}
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
