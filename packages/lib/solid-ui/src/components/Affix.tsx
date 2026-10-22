/**
 * Affix — pins children to the viewport top once scrolled past an offset.
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AffixProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Scroll distance (px) before pinning @default 0 */
	offsetTop?: number;
	/** Pinned position @default "top" */
	position?: "top" | "bottom";
	/** Use fixed positioning when pinned (set false inside preview frames) @default true */
	fixed?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Affix(props: AffixProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"offsetTop",
		"position",
		"fixed",
		"radius",
		"elevation",
	]);
	const [pinned, setPinned] = createSignal(false);
	let el: HTMLDivElement | undefined;

	const onScroll = () => {
		if (!el) return;
		setPinned(el.getBoundingClientRect().top <= (local.offsetTop ?? 0));
	};

	onMount(() => {
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
	});
	onCleanup(() => window.removeEventListener("scroll", onScroll));

	return (
		<div
			ref={el}
			class={`solidui-affix ${(local.fixed ?? true) && pinned() ? `fixed ${local.position === "bottom" ? "bottom-4" : "top-4"} z-sticky` : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</div>
	);
}
